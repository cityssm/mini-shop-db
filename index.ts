import type * as types from "./types";
import type { config as MSSQLConfig } from "mssql";

/*
 * Config
 */

let config: types.MiniShopConfig = {
  products: {},
  fees: {}
};

export const setConfig = (miniShopConfig: types.MiniShopConfig) => {
  config = miniShopConfig;
}

export const setMSSQLConfig = (mssqlConfig: MSSQLConfig) => {
  config.mssqlConfig = mssqlConfig;
};

export const setOrderNumberFunction = (orderNumberFunction: () => string) => {
  config.orderNumberFunction = orderNumberFunction;
};

export const setFees = (fees: { [feeName: string]: types.Fee }) => {
  config.fees = fees;
}

/*
 * Update Functions
 */

import { _acknowledgeOrderItem } from "./acknowledgeOrderItem.js";
export const acknowledgeOrderItem = async (orderID: number | string, itemIndex: number | string, acknowledgeValues: {
  acknowledgedUser: string;
  acknowledgedTime?: Date;
}) => {
  return await _acknowledgeOrderItem(config, orderID, itemIndex, acknowledgeValues);
}

import { _createOrder } from "./createOrder.js";
export const createOrder = async (shippingForm: types.ShippingForm) => {
  return await _createOrder(config, shippingForm);
};

import { _unacknowledgeOrderItem } from "./unacknowledgeOrderItem.js";
export const unacknowledgeOrderItem = async (orderID: number | string, itemIndex: number | string) => {
  return await _unacknowledgeOrderItem(config, orderID, itemIndex);
};

import { _updateOrderAsPaid } from "./updateOrderAsPaid.js";
export const updateOrderAsPaid = async (validOrder: types.StoreValidatorReturn) => {
  return await _updateOrderAsPaid(config, validOrder);
};

/*
 * Read Only Functions
 */

import { _getOrder } from "./getOrder.js";
export const getOrder = async (orderNumber: string, orderSecret: string, orderIsPaid: boolean, enforceExpiry = true) => {
  return await _getOrder(config, orderNumber, orderSecret, orderIsPaid, enforceExpiry);
};

import { _getOrderItem } from "./getOrderItem.js";
export const getOrderItem = async (orderID: number | string, itemIndex: number | string) => {
  return await _getOrderItem(config, orderID, itemIndex);
};

import { _getOrderNumberBySecret } from "./getOrderNumberBySecret.js";
export const getOrderNumberBySecret = async (orderSecret: string) => {
  return await _getOrderNumberBySecret(config, orderSecret);
};

import { _getOrders, GetOrderFilters } from "./getOrders.js";
export const getOrders = async (filters: GetOrderFilters) => {
  return await _getOrders(config, filters);
};

import { _isOrderFoundAndPaid } from "./isOrderFoundAndPaid.js";
export const isOrderFoundAndPaid = async (orderNumber: string, orderSecret: string) => {
  return await _isOrderFoundAndPaid(config, orderNumber, orderSecret);
};
