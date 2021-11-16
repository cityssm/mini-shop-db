import assert from "assert";
import * as miniShopDB from "../index.js";
import * as configFile from "./config.test.js";
const testProduct = {
    productSKU: "TEST_ITEM",
    price: 4.5
};
const testOrderData = {
    orderID: -1,
    orderNumber: "",
    orderTime: new Date(),
    shippingName: "Test Order",
    shippingAddress1: "C/O Test User",
    shippingAddress2: "123 Testing Drive",
    shippingCity: "Sault Ste. Marie",
    shippingProvince: "Ontario",
    shippingCountry: "Canada",
    shippingPostalCode: "A1A 1A1",
    shippingPhoneNumberDay: "555-555-5555",
    shippingPhoneNumberEvening: "555-555-5556",
    shippingEmailAddress: "testing@example.com",
    orderIsPaid: false,
    orderIsRefunded: false,
    items: [{
            itemIndex: 0,
            productSKU: testProduct.productSKU,
            quantity: 4,
            unitPrice: testProduct.price,
            itemTotal: (4 * testProduct.price),
            itemIsAcknowledged: false
        }]
};
describe("mini-shop-db", () => {
    before(() => {
        miniShopDB.setConfig({
            mssqlConfig: configFile.config,
            orderNumberFunction: () => {
                return "testing-" + Date.now();
            },
            products: {
                TEST_ITEM: testProduct
            }
        });
    });
    after(() => {
        miniShopDB.releaseAll();
    });
    let orderID;
    let orderNumber;
    let orderSecret;
    it("runs getOrders()", async () => {
        const orders = await miniShopDB.getOrders({});
        assert.strictEqual(typeof (orders), "object");
    });
    it("runs createOrder()", async () => {
        const newOrder = await miniShopDB.createOrder({
            fullName: testOrderData.shippingName,
            address: testOrderData.shippingAddress1,
            address2: testOrderData.shippingAddress2,
            city: testOrderData.shippingCity,
            province: testOrderData.shippingProvince,
            country: testOrderData.shippingCountry,
            postalCode: testOrderData.shippingPostalCode,
            phoneNumberDay: testOrderData.shippingPhoneNumberDay,
            phoneNumberEvening: testOrderData.shippingPhoneNumberEvening,
            emailAddress: testOrderData.shippingEmailAddress,
            cartItems: [{
                    productSKU: testOrderData.items[0].productSKU,
                    quantity: testOrderData.items[0].quantity.toString(),
                    unitPrice: testOrderData.items[0].unitPrice.toFixed(2)
                }]
        });
        if (!newOrder || !newOrder.success) {
            assert.fail();
        }
        else {
            orderNumber = newOrder.orderNumber;
            orderSecret = newOrder.orderSecret;
            assert.ok(1);
        }
    });
    it("fails to refund an unpaid order", async () => {
        const success = await miniShopDB.updateOrderAsRefunded(orderNumber, orderSecret, {
            refundID: "-1",
            refundUser: "testing",
            refundReason: "Test Transaction"
        });
        assert.strictEqual(success, false);
    });
    it("runs isOrderFoundAndPaid() - finds order as unpaid", async () => {
        const result = await miniShopDB.isOrderFoundAndPaid(orderNumber, orderSecret);
        if (result.found && !result.paid) {
            assert.ok(1);
        }
        else {
            assert.fail();
        }
    });
    it("runs getOrder() - filters out unpaid", async () => {
        const order = await miniShopDB.getOrder(orderNumber, orderSecret, true);
        assert.strictEqual(order, false);
    });
    it("runs updateOrderAsPaid()", async () => {
        const success = await miniShopDB.updateOrderAsPaid({
            isValid: true,
            orderNumber,
            orderSecret,
            paymentID: "-1"
        });
        assert.strictEqual(success, true);
    });
    it("runs getOrderNumberBySecret()", async () => {
        const databaseOrderNumber = await miniShopDB.getOrderNumberBySecret(orderSecret);
        assert.strictEqual(databaseOrderNumber, orderNumber);
    });
    it("runs getOrder() - data matches", async () => {
        const order = await miniShopDB.getOrder(orderNumber, orderSecret, true);
        if (!order) {
            assert.fail("Order not found");
        }
        else if (order.orderNumber !== orderNumber) {
            assert.fail("orderNumber mismatch");
        }
        else if (order.orderSecret !== orderSecret) {
            assert.fail("orderSecret mismatch");
        }
        else if (order.shippingName !== testOrderData.shippingName) {
            assert.fail("shippingName mismatch");
        }
        else {
            orderID = order.orderID;
            assert.ok(1);
        }
    });
    it("fails to delete paid order", async () => {
        const success = await miniShopDB.deleteOrder(orderID, {
            deleteUser: "testing",
            deleteReason: "Test Transaction"
        });
        assert.strictEqual(success, false);
    });
    it("runs isOrderFoundAndPaid() - finds order as paid", async () => {
        const result = await miniShopDB.isOrderFoundAndPaid(orderNumber, orderSecret);
        if (result.found && result.paid) {
            assert.ok(1);
        }
        else {
            assert.fail();
        }
    });
    it("runs acknowledgeOrderItem()", async () => {
        const success = await miniShopDB.acknowledgeOrderItem(orderID, 0, {
            acknowledgedUser: "testing"
        });
        assert.strictEqual(success, true);
    });
    it("runs unacknowledgeOrderItem()", async () => {
        const success = await miniShopDB.unacknowledgeOrderItem(orderID, 0);
        assert.strictEqual(success, true);
    });
    it("runs updateOrderAsRefunded()", async () => {
        const success = await miniShopDB.updateOrderAsRefunded(orderNumber, orderSecret, {
            refundID: "-1",
            refundUser: "testing",
            refundReason: "Test Transaction"
        });
        assert.strictEqual(success, true);
    });
    it("runs isOrderFoundAndPaid() - order not found", async () => {
        const result = await miniShopDB.isOrderFoundAndPaid(orderNumber, orderSecret);
        if (!result.found) {
            assert.ok(1);
        }
        else {
            assert.fail();
        }
    });
    it("runs deleteOrder()", async () => {
        const success = await miniShopDB.deleteOrder(orderID, {
            deleteUser: "testing",
            deleteReason: "Test Transaction"
        });
        assert.strictEqual(success, true);
    });
    it("can no longer retrieve order", async () => {
        const order = await miniShopDB.getOrder(orderNumber, orderSecret, true);
        if (order) {
            assert.fail("Order still available.");
        }
        else {
            assert.ok(1);
        }
    });
});
