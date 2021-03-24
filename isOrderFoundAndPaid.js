"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isOrderFoundAndPaid = void 0;
const sqlPool = require("@cityssm/mssql-multi-pool");
const sql = require("mssql");
const config = require("./config");
const debug_1 = require("debug");
const debugSQL = debug_1.debug("mini-shop-db:isOrderFoundAndPaid");
const isOrderFoundAndPaid = async (orderNumber, orderSecret) => {
    try {
        const pool = await sqlPool.connect(config.getMSSQLConfig());
        const orderResult = await pool.request()
            .input("orderNumber", sql.VarChar(50), orderNumber)
            .input("orderSecret", sql.UniqueIdentifier, orderSecret)
            .query("select orderID, orderIsPaid from MiniShop.Orders" +
            " where orderIsRefunded = 0 and orderIsDeleted = 0" +
            " and orderNumber = @orderNumber" +
            " and orderSecret = @orderSecret");
        if (orderResult.recordset && orderResult.recordset.length === 1) {
            const order = orderResult.recordset[0];
            return {
                found: true,
                orderID: order.orderID,
                paid: order.orderIsPaid
            };
        }
    }
    catch (e) {
        debugSQL(e);
    }
    return {
        found: false,
        paid: false
    };
};
exports.isOrderFoundAndPaid = isOrderFoundAndPaid;
