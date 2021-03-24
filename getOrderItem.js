"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrderItem = void 0;
const sqlPool = require("@cityssm/mssql-multi-pool");
const sql = require("mssql");
const config = require("./config");
const debug_1 = require("debug");
const debugSQL = debug_1.debug("mini-shop-db:getOrderItem");
const getOrderItem = async (orderID, itemIndex) => {
    try {
        const pool = await sqlPool.connect(config.getMSSQLConfig());
        const orderItemResult = await pool.request()
            .input("orderID", orderID)
            .input("itemIndex", itemIndex)
            .query("select itemIndex, productSKU, unitPrice, quantity, itemTotal" +
            " from MiniShop.OrderItems" +
            " where orderID = @orderID" +
            " and itemIndex = @itemIndex" +
            " and orderID in (select orderID from MiniShop.Orders where orderIsDeleted = 0)");
        if (!orderItemResult.recordset || orderItemResult.recordset.length === 0) {
            return false;
        }
        const item = orderItemResult.recordset[0];
        const fieldsResult = await pool.request()
            .input("orderID", sql.BigInt, orderID)
            .input("itemIndex", itemIndex)
            .query("select formFieldName, fieldValue" +
            " from MiniShop.OrderItemFields" +
            " where orderID = @orderID" +
            " and itemIndex = @itemIndex");
        item.fields = fieldsResult.recordset;
        return item;
    }
    catch (e) {
        debugSQL(e);
    }
    return false;
};
exports.getOrderItem = getOrderItem;
