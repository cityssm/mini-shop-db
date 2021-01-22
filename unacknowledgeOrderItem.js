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
exports.unacknowledgeOrderItem = void 0;
const sqlPool = require("@cityssm/mssql-multi-pool");
const config = require("./config");
const unacknowledgeOrderItem = (orderID, itemIndex) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pool = yield sqlPool.connect(config.getMSSQLConfig());
        const result = yield pool.request()
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
        config.logger.error(e);
    }
    return false;
});
exports.unacknowledgeOrderItem = unacknowledgeOrderItem;
