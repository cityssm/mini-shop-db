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
exports.createOrder = exports.insertOrderItem = void 0;
const sqlPool = require("@cityssm/mssql-multi-pool");
const sql = require("mssql");
const config = require("./config");
exports.insertOrderItem = (pool, orderID, cartIndex, cartItem) => __awaiter(void 0, void 0, void 0, function* () {
    const product = config.getProduct(cartItem.productSKU);
    yield pool.request()
        .input("orderID", sql.BigInt, orderID)
        .input("itemIndex", sql.TinyInt, cartIndex)
        .input("productSKU", sql.VarChar(20), cartItem.productSKU)
        .input("unitPrice", sql.Money, product.price)
        .input("quantity", sql.TinyInt, cartItem.quantity)
        .query("insert into MiniShop.OrderItems (" +
        "orderID, itemIndex, productSKU, unitPrice, quantity)" +
        " values (@orderID, @itemIndex, @productSKU, @unitPrice, @quantity)");
    for (const formField of product.formFieldsToSave) {
        yield pool.request()
            .input("orderID", sql.BigInt, orderID)
            .input("itemIndex", sql.TinyInt, cartIndex)
            .input("formFieldName", sql.VarChar(30), formField.formFieldName)
            .input("fieldValue", sql.NVarChar, cartItem[formField.formFieldName])
            .query("insert into MiniShop.OrderItemFields (" +
            "orderID, itemIndex, formFieldName, fieldValue)" +
            " values (@orderID, @itemIndex, @formFieldName, @fieldValue)");
    }
});
exports.createOrder = (shippingForm) => __awaiter(void 0, void 0, void 0, function* () {
    const orderNumber = config.getOrderNumberFunction()();
    try {
        const pool = yield sqlPool.connect(config.getMSSQLConfig());
        const orderResult = yield pool.request()
            .input("orderNumber", sql.VarChar(50), orderNumber)
            .input("shippingName", sql.NVarChar(100), shippingForm.fullName)
            .input("shippingAddress1", sql.NVarChar(100), shippingForm.address)
            .input("shippingAddress2", sql.NVarChar(100), shippingForm.address2)
            .input("shippingCity", sql.NVarChar(50), shippingForm.city)
            .input("shippingProvince", sql.NVarChar(20), shippingForm.province)
            .input("shippingCountry", sql.NVarChar(20), shippingForm.country)
            .input("shippingPostalCode", sql.NVarChar(20), shippingForm.postalCode)
            .input("shippingEmailAddress", sql.NVarChar(50), shippingForm.emailAddress)
            .input("shippingPhoneNumberDay", sql.NVarChar(50), shippingForm.phoneNumberDay)
            .input("shippingPhoneNumberEvening", sql.NVarChar(50), shippingForm.phoneNumberEvening)
            .input("redirectURL", sql.NVarChar(200), shippingForm.redirectURL)
            .query("insert into MiniShop.Orders (" +
            " orderNumber," +
            " shippingName, shippingAddress1, shippingAddress2," +
            " shippingCity, shippingProvince, shippingCountry, shippingPostalCode," +
            " shippingEmailAddress, shippingPhoneNumberDay, shippingPhoneNumberEvening, redirectURL)" +
            " output inserted.orderID, inserted.orderSecret, inserted.orderTime" +
            " values (@orderNumber, @shippingName, @shippingAddress1, @shippingAddress2," +
            " @shippingCity, @shippingProvince, @shippingCountry, @shippingPostalCode," +
            " @shippingEmailAddress, @shippingPhoneNumberDay, @shippingPhoneNumberEvening, @redirectURL)");
        const orderID = orderResult.recordset[0].orderID;
        const orderSecret = orderResult.recordset[0].orderSecret;
        const orderTime = orderResult.recordset[0].orderTime;
        const feeTotals = {};
        const allProducts = config.getProducts();
        for (let cartIndex = 0; cartIndex < shippingForm.cartItems.length; cartIndex += 1) {
            if (cartIndex > 255) {
                break;
            }
            const cartItem = shippingForm.cartItems[cartIndex];
            if (!allProducts.hasOwnProperty(cartItem.productSKU)) {
                continue;
            }
            yield exports.insertOrderItem(pool, orderID, cartIndex, cartItem);
            const product = allProducts[cartItem.productSKU];
            if (product.fees) {
                for (const feeName of product.fees) {
                    feeTotals[feeName] = (feeTotals[feeName] || 0) +
                        config.getFee(feeName).feeCalculation(product);
                }
            }
        }
        for (const feeName of Object.keys(feeTotals)) {
            yield pool.request()
                .input("orderID", sql.BigInt, orderID)
                .input("feeName", sql.VarChar(20), feeName)
                .input("feeTotal", sql.Money, feeTotals[feeName])
                .query("insert into MiniShop.OrderFees (" +
                "orderID, feeName, feeTotal)" +
                " values (@orderID, @feeName, @feeTotal)");
        }
        return {
            success: true,
            orderNumber,
            orderSecret,
            orderTime
        };
    }
    catch (_e) {
        return {
            success: false
        };
    }
});
