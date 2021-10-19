import * as sqlPool from "@cityssm/mssql-multi-pool";
import { _isOrderFoundAndPaid } from "./isOrderFoundAndPaid.js";
import debug from "debug";
const debugSQL = debug("mini-shop-db:updateOrderAsPaid");
export const _updateOrderAsPaid = async (config, validOrder) => {
    if (!validOrder.isValid) {
        return false;
    }
    const order = await _isOrderFoundAndPaid(config, validOrder.orderNumber, validOrder.orderSecret);
    if (!order.found) {
        return false;
    }
    else if (order.paid) {
        return true;
    }
    try {
        const pool = await sqlPool.connect(config.mssqlConfig);
        await pool.request()
            .input("paymentID", validOrder.paymentID)
            .input("orderID", order.orderID)
            .query("update MiniShop.Orders" +
            " set paymentID = @paymentID," +
            " paymentTime = getdate()" +
            " where orderID = @orderID");
        if (validOrder.paymentData) {
            for (const dataName of Object.keys(validOrder.paymentData)) {
                await pool.request()
                    .input("orderID", order.orderID)
                    .input("dataName", dataName)
                    .input("dataValue", validOrder.paymentData[dataName])
                    .query("insert into MiniShop.PaymentData (orderID, dataName, dataValue)" +
                    " values (@orderID, @dataName, @dataValue)");
            }
        }
        return true;
    }
    catch (error) {
        debugSQL(error);
    }
    return false;
};
export default _updateOrderAsPaid;
