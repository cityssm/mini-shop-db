"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unacknowledgeOrderItem = void 0;
const sqlPool = require("@cityssm/mssql-multi-pool");
const config = require("./config");
const debug_1 = require("debug");
const debugSQL = debug_1.debug("mini-shop-db:unacknowledgeOrderItem");
const unacknowledgeOrderItem = async (orderID, itemIndex) => {
    try {
        const pool = await sqlPool.connect(config.getMSSQLConfig());
        const result = await pool.request()
            .input("orderID", orderID)
            .input("itemIndex", itemIndex)
            .query("update MiniShop.OrderItems" +
            " set acknowledgedUser = null," +
            " acknowledgedTime = null" +
            " where orderID = @orderID" +
            " and itemIndex = @itemIndex");
        return result.rowsAffected[0] === 1;
    }
    catch (e) {
        debugSQL(e);
    }
    return false;
};
exports.unacknowledgeOrderItem = unacknowledgeOrderItem;
