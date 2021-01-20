"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrderItem = void 0;
const sqlPool = require("@cityssm/mssql-multi-pool");
const sql = require("mssql");
const config = require("./config");
const getOrderItem = (orderID, itemIndex) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pool = yield sqlPool.connect(config.getMSSQLConfig());
        const orderItemResult = yield pool.request()
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
        const fieldsResult = yield pool.request()
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
        config.logger.error(e);
    }
    return false;
});
exports.getOrderItem = getOrderItem;
