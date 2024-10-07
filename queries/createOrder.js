import sqlPool from '@cityssm/mssql-multi-pool';
import debug from 'debug';
const debugSQL = debug('mini-shop-db:createOrder');
async function insertOrderItem(config, pool, orderItem) {
    const product = config.products[orderItem.cartItem.productSKU];
    const unitPrice = typeof product.price === 'number'
        ? product.price
        : Number.parseFloat(orderItem.cartItem.unitPrice);
    // Create the item record
    await pool
        .request()
        .input('orderID', orderItem.orderID)
        .input('itemIndex', orderItem.cartIndex)
        .input('productSKU', orderItem.cartItem.productSKU)
        .input('unitPrice', unitPrice)
        .input('quantity', orderItem.cartItem.quantity)
        .query(`insert into MiniShop.OrderItems (
        orderID, itemIndex, productSKU, unitPrice, quantity)
        values (@orderID, @itemIndex, @productSKU, @unitPrice, @quantity)`);
    // Create the item field records
    for (const formField of product.formFieldsToSave ?? []) {
        await pool
            .request()
            .input('orderID', orderItem.orderID)
            .input('itemIndex', orderItem.cartIndex)
            .input('formFieldName', formField.formFieldName)
            .input('fieldValue', orderItem.cartItem[formField.formFieldName] ?? '')
            .query(`insert into MiniShop.OrderItemFields (
          orderID, itemIndex, formFieldName, fieldValue)
          values (@orderID, @itemIndex, @formFieldName, @fieldValue)`);
    }
}
/**
 * Creates a new Order record.
 * @param config - MSSQL donfig
 * @param shippingForm - Shipping form
 * @returns Create result
 */
export default async function _createOrder(config, shippingForm) {
    const orderNumberFunction = config.orderNumberFunction;
    const orderNumber = orderNumberFunction();
    try {
        const pool = await sqlPool.connect(config.mssqlConfig);
        // Create the Order record
        const orderResult = (await pool
            .request()
            .input('orderNumber', orderNumber)
            .input('shippingName', (shippingForm.fullName ?? '').trim())
            .input('shippingAddress1', (shippingForm.address ?? '').trim())
            .input('shippingAddress2', (shippingForm.address2 ?? '').trim())
            .input('shippingCity', (shippingForm.city ?? '').trim())
            .input('shippingProvince', (shippingForm.province ?? '').trim())
            .input('shippingCountry', (shippingForm.country ?? '').trim())
            .input('shippingPostalCode', (shippingForm.postalCode ?? '').trim())
            .input('shippingEmailAddress', (shippingForm.emailAddress ?? '').trim())
            .input(
        // eslint-disable-next-line no-secrets/no-secrets
        'shippingPhoneNumberDay', (shippingForm.phoneNumberDay ?? '').trim())
            .input('shippingPhoneNumberEvening', (shippingForm.phoneNumberEvening ?? '').trim())
            .input('redirectURL', (shippingForm.redirectURL ?? '').trim())
            .query(`insert into MiniShop.Orders (
            orderNumber,
            shippingName, shippingAddress1, shippingAddress2,
            shippingCity, shippingProvince, shippingCountry, shippingPostalCode,
            shippingEmailAddress, shippingPhoneNumberDay, shippingPhoneNumberEvening,
            redirectURL)
          output inserted.orderID, inserted.orderSecret, inserted.orderTime
          values (@orderNumber,
            @shippingName, @shippingAddress1, @shippingAddress2,
            @shippingCity, @shippingProvince, @shippingCountry, @shippingPostalCode,
            @shippingEmailAddress, @shippingPhoneNumberDay, @shippingPhoneNumberEvening,
            @redirectURL)`));
        const insertedOrder = orderResult.recordset[0];
        // Loop through the cart items
        const feeTotals = {};
        const allProducts = config.products;
        for (let cartIndex = 0; cartIndex < (shippingForm.cartItems ?? []).length; cartIndex += 1) {
            // Maximum number of items allowed in the cart
            if (cartIndex > 255) {
                break;
            }
            const cartItem = (shippingForm.cartItems ?? [])[cartIndex];
            // Ignore invalid SKUs
            if (!Object.hasOwn(allProducts, cartItem.productSKU)) {
                debugSQL(`Invalid SKU: ${cartItem.productSKU}`);
                continue;
            }
            // Create the item record
            await insertOrderItem(config, pool, {
                orderID: insertedOrder.orderID,
                cartIndex,
                cartItem
            });
            // Calculate the fees (if any)
            const product = allProducts[cartItem.productSKU];
            for (const feeName of product.fees ?? []) {
                feeTotals[feeName] =
                    (feeTotals[feeName] ?? 0) +
                        config.fees[feeName].feeCalculation(product);
            }
        }
        // Create the fee records (if any)
        for (const feeName of Object.keys(feeTotals)) {
            await pool
                .request()
                .input('orderID', insertedOrder.orderID)
                .input('feeName', feeName)
                .input('feeTotal', feeTotals[feeName])
                .query(`insert into MiniShop.OrderFees (
            orderID, feeName, feeTotal)
            values (@orderID, @feeName, @feeTotal)`);
        }
        return {
            success: true,
            orderNumber,
            orderSecret: insertedOrder.orderSecret,
            orderTime: insertedOrder.orderTime
        };
    }
    catch (error) {
        debugSQL(error);
        return {
            success: false
        };
    }
}
