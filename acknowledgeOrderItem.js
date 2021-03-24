"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.acknowledgeOrderItem = void 0;
const sqlPool = require("@cityssm/mssql-multi-pool");
const config = require("./config");
const debug_1 = require("debug");
const debugSQL = debug_1.debug("mini-shop-db:acknowledgeOrderItem");
const acknowledgeOrderItem = async (orderID, itemIndex, acknowledgeValues) => {
    try {
        const pool = await sqlPool.connect(config.getMSSQLConfig());
        const result = await pool.request()
            .input("acknowledgedUser", acknowledgeValues.acknowledgedUser)
            .input("acknowledgedTime", acknowledgeValues.hasOwnProperty("acknowledgedTime") ? acknowledgeValues.acknowledgedTime : new Date())
            .input("orderID", orderID)
            .input("itemIndex", itemIndex)
            .query("update MiniShop.OrderItems" +
            " set acknowledgedUser = @acknowledgedUser," +
            " acknowledgedTime = @acknowledgedTime" +
            " where orderID = @orderID" +
            " and itemIndex = @itemIndex");
        return result.rowsAffected[0] === 1;
    }
    catch (e) {
        debugSQL(e);
    }
    return false;
};
exports.acknowledgeOrderItem = acknowledgeOrderItem;
