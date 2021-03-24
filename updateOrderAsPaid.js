"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderAsPaid = void 0;
const sqlPool = require("@cityssm/mssql-multi-pool");
const sql = require("mssql");
const config = require("./config");
const isOrderFoundAndPaid_1 = require("./isOrderFoundAndPaid");
const debug_1 = require("debug");
const debugSQL = debug_1.debug("mini-shop-db:updateOrderAsPaid");
const updateOrderAsPaid = async (validOrder) => {
    if (!validOrder.isValid) {
        return false;
    }
    const order = await isOrderFoundAndPaid_1.isOrderFoundAndPaid(validOrder.orderNumber, validOrder.orderSecret);
    if (!order.found) {
        return false;
    }
    else if (order.paid) {
        return true;
    }
    try {
        const pool = await sqlPool.connect(config.getMSSQLConfig());
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
    catch (e) {
        debugSQL(e);
    }
    return false;
};
exports.updateOrderAsPaid = updateOrderAsPaid;
