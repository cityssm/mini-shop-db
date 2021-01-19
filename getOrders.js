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
exports.getOrders = void 0;
const sqlPool = require("@cityssm/mssql-multi-pool");
const config = require("./config");
;
const getOrders = (filters) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pool = yield sqlPool.connect(config.getMSSQLConfig());
        let sql = "select o.orderID, o.orderNumber, o.orderTime," +
            " o.shippingName, o.shippingAddress1, o.shippingAddress2, o.shippingCity, o.shippingProvince, o.shippingCountry, o.shippingPostalCode," +
            " o.shippingEmailAddress, o.shippingPhoneNumberDay, o.shippingPhoneNumberEvening," +
            " o.paymentID, o.paymentTime, o.orderIsPaid," +
            " o.refundID, o.refundTime, o.refundReason, o.orderIsRefunded," +
            " i.itemIndex, i.productSKU, i.unitPrice, i.quantity, i.itemTotal," +
            " i.acknowledgedTime, i.acknowledgedUser, i.itemIsAcknowledged," +
            " f.formFieldName, f.fieldValue" +
            " from MiniShop.OrderItems i" +
            " left join MiniShop.Orders o on i.orderID = o.orderID" +
            " left join MiniShop.OrderItemFields f on i.orderID = f.orderID and i.itemIndex = f.itemIndex" +
            " where o.orderIsDeleted = 1";
        if (filters.hasOwnProperty("productSKUs")) {
            sql += " and i.productSKU in ('" + filters.productSKUs.join("','") + "')";
        }
        if (filters.hasOwnProperty("orderIsPaid")) {
            sql += " and o.orderIsPaid = " + filters.orderIsPaid.toString();
        }
        if (filters.hasOwnProperty("orderIsRefunded")) {
            sql += " and o.orderIsRefunded = " + filters.orderIsRefunded.toString();
        }
        sql += " order by o.orderID desc, i.itemIndex asc, f.formFieldName";
        const rawResult = yield pool.request()
            .query(sql);
        if (!rawResult.recordset || rawResult.recordset.length === 0) {
            return [];
        }
        const rawOrders = rawResult.recordset;
        const orders = [];
        let order = null;
        let item = null;
        for (const rawOrder of rawOrders) {
            if (order !== null && order.orderID !== rawOrder.orderID) {
                order.items.push(item);
                item = null;
                orders.push(order);
                order = null;
            }
            if (order === null) {
                order = {
                    orderID: rawOrder.orderID,
                    orderNumber: rawOrder.orderNumber,
                    orderTime: rawOrder.orderTime,
                    shippingName: rawOrder.shippingName,
                    shippingAddress1: rawOrder.shippingAddress1,
                    shippingAddress2: rawOrder.shippingAddress2,
                    shippingCity: rawOrder.shippingCity,
                    shippingProvince: rawOrder.shippingProvince,
                    shippingCountry: rawOrder.shippingCountry,
                    shippingPostalCode: rawOrder.shippingPostalCode,
                    shippingPhoneNumberDay: rawOrder.shippingPhoneNumberDay,
                    shippingPhoneNumberEvening: rawOrder.shippingPhoneNumberEvening,
                    shippingEmailAddress: rawOrder.shippingEmailAddress,
                    paymentID: rawOrder.paymentID,
                    paymentTime: rawOrder.paymentTime,
                    orderIsPaid: rawOrder.orderIsPaid,
                    refundID: rawOrder.refundID,
                    refundTime: rawOrder.refundTime,
                    refundUser: rawOrder.refundUser,
                    refundReason: rawOrder.refundReason,
                    orderIsRefunded: rawOrder.orderIsRefunded,
                    items: []
                };
            }
            if (item !== null && item.itemIndex !== rawOrder.itemIndex) {
                order.items.push(item);
                item = null;
            }
            if (item === null) {
                item = {
                    itemIndex: rawOrder.itemIndex,
                    productSKU: rawOrder.productSKU,
                    unitPrice: rawOrder.unitPrice,
                    quantity: rawOrder.quantity,
                    itemTotal: rawOrder.itemTotal,
                    fields: [],
                    acknowledgedTime: rawOrder.acknowledgedTime,
                    acknowledgedUser: rawOrder.acknowledgedUser,
                    itemIsAcknowledged: rawOrder.itemIsAcknowledged
                };
            }
            if (rawOrder.formFieldName !== null) {
                item.fields.push({
                    formFieldName: rawOrder.formFieldName,
                    fieldValue: rawOrder.fieldValue
                });
            }
        }
        order.items.push(item);
        orders.push(order);
        return orders;
    }
    catch (e) {
        config.logger.error(e);
    }
    return [];
});
exports.getOrders = getOrders;
