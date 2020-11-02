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
exports.getOrder = void 0;
const sqlPool = require("@cityssm/mssql-multi-pool");
const sql = require("mssql");
const config = require("./config");
exports.getOrder = (orderNumber, orderSecret, orderIsPaid) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pool = yield sqlPool.connect(config.getMSSQLConfig());
        const orderResult = yield pool.request()
            .input("orderNumber", sql.VarChar(50), orderNumber)
            .input("orderSecret", sql.UniqueIdentifier, orderSecret)
            .input("orderIsPaid", sql.Bit, orderIsPaid ? 1 : 0)
            .query("select orderID, orderNumber, orderSecret, orderTime," +
            " shippingName, shippingAddress1, shippingAddress2," +
            " shippingCity, shippingProvince, shippingCountry, shippingPostalCode," +
            " shippingEmailAddress, shippingPhoneNumberDay, shippingPhoneNumberEvening," +
            " paymentID, paymentTime" +
            " from MiniShop.Orders" +
            " where orderIsRefunded = 0 and orderIsDeleted = 0" +
            " and (datediff(minute, orderTime, getdate()) < 60 or datediff(minute, paymentTime, getdate()) < 120)" +
            " and orderNumber = @orderNumber" +
            " and orderSecret = @orderSecret" +
            " and orderIsPaid = @orderIsPaid");
        if (!orderResult.recordset || orderResult.recordset.length === 0) {
            return false;
        }
        const order = orderResult.recordset[0];
        const orderItemsResult = yield pool.request()
            .input("orderID", sql.BigInt, order.orderID)
            .query("select itemIndex, productSKU, unitPrice, quantity, itemTotal" +
            " from MiniShop.OrderItems" +
            " where orderID = @orderID");
        order.items = orderItemsResult.recordset;
        const orderFeesResult = yield pool.request()
            .input("orderID", sql.BigInt, order.orderID)
            .query("select feeName, feeTotal" +
            " from MiniShop.OrderFees" +
            " where orderID = @orderID");
        order.fees = orderFeesResult.recordset;
        if (orderIsPaid) {
            const paymentDataResult = yield pool.request()
                .input("orderID", sql.BigInt, order.orderID)
                .query("select dataName, dataValue" +
                " from MiniShop.PaymentData" +
                " where orderID = @orderID");
            order.paymentData = paymentDataResult.recordset;
        }
        return order;
    }
    catch (e) {
        console.log(e);
    }
    return false;
});
