import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as sql from "mssql";
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
            .input("paymentID", sql.NVarChar(50), validOrder.paymentID)
            .input("orderID", sql.BigInt, order.orderID)
            .query("update MiniShop.Orders" +
            " set paymentID = @paymentID," +
            " paymentTime = getdate()" +
            " where orderID = @orderID");
        if (validOrder.paymentData) {
            for (const dataName of Object.keys(validOrder.paymentData)) {
                await pool.request()
                    .input("orderID", sql.BigInt, order.orderID)
                    .input("dataName", sql.VarChar(30), dataName)
                    .input("dataValue", sql.NVarChar, validOrder.paymentData[dataName])
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
