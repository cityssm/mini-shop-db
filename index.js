let config = {
    products: {},
    fees: {}
};
export const setConfig = (miniShopConfig) => {
    config = miniShopConfig;
};
export const setMSSQLConfig = (mssqlConfig) => {
    config.mssqlConfig = mssqlConfig;
};
export const setOrderNumberFunction = (orderNumberFunction) => {
    config.orderNumberFunction = orderNumberFunction;
};
export const setFees = (fees) => {
    config.fees = fees;
};
import { _acknowledgeOrderItem } from "./acknowledgeOrderItem.js";
export const acknowledgeOrderItem = async (orderID, itemIndex, acknowledgeValues) => {
    return await _acknowledgeOrderItem(config, orderID, itemIndex, acknowledgeValues);
};
import { _createOrder } from "./createOrder.js";
export const createOrder = async (shippingForm) => {
    return await _createOrder(config, shippingForm);
};
import { _unacknowledgeOrderItem } from "./unacknowledgeOrderItem.js";
export const unacknowledgeOrderItem = async (orderID, itemIndex) => {
    return await _unacknowledgeOrderItem(config, orderID, itemIndex);
};
import { _updateOrderAsPaid } from "./updateOrderAsPaid.js";
export const updateOrderAsPaid = async (validOrder) => {
    return await _updateOrderAsPaid(config, validOrder);
};
import { _getOrder } from "./getOrder.js";
export const getOrder = async (orderNumber, orderSecret, orderIsPaid, enforceExpiry = true) => {
    return await _getOrder(config, orderNumber, orderSecret, orderIsPaid, enforceExpiry);
};
import { _getOrderItem } from "./getOrderItem.js";
export const getOrderItem = async (orderID, itemIndex) => {
    return await _getOrderItem(config, orderID, itemIndex);
};
import { _getOrderNumberBySecret } from "./getOrderNumberBySecret.js";
export const getOrderNumberBySecret = async (orderSecret) => {
    return await _getOrderNumberBySecret(config, orderSecret);
};
import { _getOrders } from "./getOrders.js";
export const getOrders = async (filters) => {
    return await _getOrders(config, filters);
};
import { _isOrderFoundAndPaid } from "./isOrderFoundAndPaid.js";
export const isOrderFoundAndPaid = async (orderNumber, orderSecret) => {
    return await _isOrderFoundAndPaid(config, orderNumber, orderSecret);
};
