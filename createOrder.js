import * as sqlPool from "@cityssm/mssql-multi-pool";
import debug from "debug";
const debugSQL = debug("mini-shop-db:createOrder");
const insertOrderItem = async (config, pool, orderID, cartIndex, cartItem) => {
    const product = config.products[cartItem.productSKU];
    const unitPrice = (typeof (product.price) === "number" ? product.price : Number.parseFloat(cartItem.unitPrice));
    await pool.request()
        .input("orderID", orderID)
        .input("itemIndex", cartIndex)
        .input("productSKU", cartItem.productSKU)
        .input("unitPrice", unitPrice)
        .input("quantity", cartItem.quantity)
        .query("insert into MiniShop.OrderItems (" +
        "orderID, itemIndex, productSKU, unitPrice, quantity)" +
        " values (@orderID, @itemIndex, @productSKU, @unitPrice, @quantity)");
    if (product.formFieldsToSave) {
        for (const formField of product.formFieldsToSave) {
            await pool.request()
                .input("orderID", orderID)
                .input("itemIndex", cartIndex)
                .input("formFieldName", formField.formFieldName)
                .input("fieldValue", cartItem[formField.formFieldName] || "")
                .query("insert into MiniShop.OrderItemFields (" +
                "orderID, itemIndex, formFieldName, fieldValue)" +
                " values (@orderID, @itemIndex, @formFieldName, @fieldValue)");
        }
    }
};
export const _createOrder = async (config, shippingForm) => {
    const orderNumberFunction = config.orderNumberFunction;
    const orderNumber = orderNumberFunction();
    try {
        const pool = await sqlPool.connect(config.mssqlConfig);
        const orderResult = await pool.request()
            .input("orderNumber", orderNumber)
            .input("shippingName", shippingForm.fullName)
            .input("shippingAddress1", shippingForm.address)
            .input("shippingAddress2", shippingForm.address2)
            .input("shippingCity", shippingForm.city)
            .input("shippingProvince", shippingForm.province)
            .input("shippingCountry", shippingForm.country)
            .input("shippingPostalCode", shippingForm.postalCode)
            .input("shippingEmailAddress", shippingForm.emailAddress)
            .input("shippingPhoneNumberDay", shippingForm.phoneNumberDay)
            .input("shippingPhoneNumberEvening", shippingForm.phoneNumberEvening)
            .input("redirectURL", shippingForm.redirectURL)
            .query("insert into MiniShop.Orders (" +
            " orderNumber," +
            " shippingName, shippingAddress1, shippingAddress2," +
            " shippingCity, shippingProvince, shippingCountry, shippingPostalCode," +
            " shippingEmailAddress, shippingPhoneNumberDay, shippingPhoneNumberEvening, redirectURL)" +
            " output inserted.orderID, inserted.orderSecret, inserted.orderTime" +
            " values (@orderNumber, @shippingName, @shippingAddress1, @shippingAddress2," +
            " @shippingCity, @shippingProvince, @shippingCountry, @shippingPostalCode," +
            " @shippingEmailAddress, @shippingPhoneNumberDay, @shippingPhoneNumberEvening, @redirectURL)");
        const orderID = orderResult.recordset[0].orderID;
        const orderSecret = orderResult.recordset[0].orderSecret;
        const orderTime = orderResult.recordset[0].orderTime;
        const feeTotals = {};
        const allProducts = config.products;
        for (let cartIndex = 0; cartIndex < shippingForm.cartItems.length; cartIndex += 1) {
            if (cartIndex > 255) {
                break;
            }
            const cartItem = shippingForm.cartItems[cartIndex];
            if (!Object.prototype.hasOwnProperty.call(allProducts, cartItem.productSKU)) {
                debugSQL("Invalid SKU: " + cartItem.productSKU);
                continue;
            }
            await insertOrderItem(config, pool, orderID, cartIndex, cartItem);
            const product = allProducts[cartItem.productSKU];
            if (product.fees) {
                for (const feeName of product.fees) {
                    feeTotals[feeName] = (feeTotals[feeName] || 0) +
                        config.fees[feeName].feeCalculation(product);
                }
            }
        }
        for (const feeName of Object.keys(feeTotals)) {
            await pool.request()
                .input("orderID", orderID)
                .input("feeName", feeName)
                .input("feeTotal", feeTotals[feeName])
                .query("insert into MiniShop.OrderFees (" +
                "orderID, feeName, feeTotal)" +
                " values (@orderID, @feeName, @feeTotal)");
        }
        return {
            success: true,
            orderNumber,
            orderSecret,
            orderTime
        };
    }
    catch (error) {
        debugSQL(error);
        return {
            success: false
        };
    }
};
export default _createOrder;
