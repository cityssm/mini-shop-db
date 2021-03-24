"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrderNumberBySecret = void 0;
const sqlPool = require("@cityssm/mssql-multi-pool");
const sql = require("mssql");
const config = require("./config");
const debug_1 = require("debug");
const debugSQL = debug_1.debug("mini-shop-db:getOrderNumberBySecret");
const getOrderNumberBySecret = async (orderSecret) => {
    try {
        const pool = await sqlPool.connect(config.getMSSQLConfig());
        const orderResult = await pool.request()
            .input("orderSecret", sql.UniqueIdentifier, orderSecret)
            .query("select orderNumber" +
            " from MiniShop.Orders" +
            " where orderIsRefunded = 0 and orderIsDeleted = 0" +
            " and orderSecret = @orderSecret");
        if (!orderResult.recordset || orderResult.recordset.length === 0) {
            return false;
        }
        return orderResult.recordset[0].orderNumber;
    }
    catch (e) {
        debugSQL(e);
    }
    return false;
};
exports.getOrderNumberBySecret = getOrderNumberBySecret;
