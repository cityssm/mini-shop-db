import * as sqlPool from "@cityssm/mssql-multi-pool";
import debug from "debug";
const debugSQL = debug("mini-shop-db:getOrder");
export const _getOrder = async (config, orderNumber, orderSecret, orderIsPaid, enforceExpiry = true) => {
    try {
        const pool = await sqlPool.connect(config.mssqlConfig);
        const orderResult = await pool.request()
            .input("orderNumber", orderNumber)
            .input("orderSecret", orderSecret)
            .input("orderIsPaid", orderIsPaid ? 1 : 0)
            .query("select orderID, orderNumber, orderSecret, orderTime," +
            " shippingName, shippingAddress1, shippingAddress2," +
            " shippingCity, shippingProvince, shippingCountry, shippingPostalCode," +
            " shippingEmailAddress, shippingPhoneNumberDay, shippingPhoneNumberEvening," +
            " paymentID, paymentTime, redirectURL" +
            " from MiniShop.Orders" +
            " where orderIsRefunded = 0 and orderIsDeleted = 0" +
            (enforceExpiry
                ? " and (datediff(minute, orderTime, getdate()) < 90 or datediff(minute, paymentTime, getdate()) < 180)"
                : "") +
            " and orderNumber = @orderNumber" +
            " and orderSecret = @orderSecret" +
            " and orderIsPaid = @orderIsPaid");
        if (!orderResult.recordset || orderResult.recordset.length === 0) {
            return false;
        }
        const order = orderResult.recordset[0];
        const orderItemsResult = await pool.request()
            .input("orderID", order.orderID)
            .query("select itemIndex, productSKU, unitPrice, quantity, itemTotal" +
            " from MiniShop.OrderItems" +
            " where orderID = @orderID");
        order.items = orderItemsResult.recordset;
        const fieldsResult = await pool.request()
            .input("orderID", order.orderID)
            .query("select itemIndex, formFieldName, fieldValue" +
            " from MiniShop.OrderItemFields" +
            " where orderID = @orderID");
        if (fieldsResult.recordset && fieldsResult.recordset.length > 0) {
            const fieldsMap = new Map();
            const fieldsList = fieldsResult.recordset;
            for (const fieldData of fieldsList) {
                if (fieldsMap.has(fieldData.itemIndex)) {
                    fieldsMap.get(fieldData.itemIndex).push(fieldData);
                }
                else {
                    fieldsMap.set(fieldData.itemIndex, [fieldData]);
                }
            }
            for (const orderItem of order.items) {
                if (fieldsMap.has(orderItem.itemIndex)) {
                    orderItem.fields = fieldsMap.get(orderItem.itemIndex);
                }
            }
        }
        const orderFeesResult = await pool.request()
            .input("orderID", order.orderID)
            .query("select feeName, feeTotal" +
            " from MiniShop.OrderFees" +
            " where orderID = @orderID");
        order.fees = orderFeesResult.recordset;
        if (orderIsPaid) {
            const paymentDataResult = await pool.request()
                .input("orderID", order.orderID)
                .query("select dataName, dataValue" +
                " from MiniShop.PaymentData" +
                " where orderID = @orderID");
            order.paymentData = paymentDataResult.recordset;
        }
        return order;
    }
    catch (error) {
        debugSQL(error);
    }
    return false;
};
export default _getOrder;
