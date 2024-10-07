import { releaseAll as pool_releaseAll } from '@cityssm/mssql-multi-pool';
import exitHook from 'exit-hook';
import _acknowledgeOrderItem from './queries/acknowledgeOrderItem.js';
import _createOrder from './queries/createOrder.js';
import _deleteOrder from './queries/deleteOrder.js';
import _getOrder from './queries/getOrder.js';
import _getOrderItem from './queries/getOrderItem.js';
import _getOrderNumberBySecret from './queries/getOrderNumberBySecret.js';
import _getOrders from './queries/getOrders.js';
import _isOrderFoundAndPaid from './queries/isOrderFoundAndPaid.js';
import _unacknowledgeOrderItem from './queries/unacknowledgeOrderItem.js';
import _updateOrderAsPaid from './queries/updateOrderAsPaid.js';
import _updateOrderAsRefunded from './queries/updateOrderAsRefunded.js';
export default class MiniShopDB {
    #config;
    constructor(miniShopConfig) {
        this.#config = miniShopConfig;
        exitHook(() => {
            void pool_releaseAll();
        });
    }
    async acknowledgeOrderItem(orderID, itemIndex, acknowledgeValues) {
        return await _acknowledgeOrderItem(this.#config, orderID, itemIndex, acknowledgeValues);
    }
    async createOrder(shippingForm) {
        return await _createOrder(this.#config, shippingForm);
    }
    async deleteOrder(orderID, deleteDetails) {
        return await _deleteOrder(this.#config, orderID, deleteDetails);
    }
    async unacknowledgeOrderItem(orderID, itemIndex) {
        return await _unacknowledgeOrderItem(this.#config, orderID, itemIndex);
    }
    async updateOrderAsPaid(validOrder) {
        return await _updateOrderAsPaid(this.#config, validOrder);
    }
    async updateOrderAsRefunded(orderNumber, orderSecret, refundDetails) {
        return await _updateOrderAsRefunded(this.#config, orderNumber, orderSecret, refundDetails);
    }
    async getOrder(orderNumber, orderSecret, orderIsPaid, enforceExpiry = true) {
        return await _getOrder(this.#config, { orderNumber, orderSecret, orderIsPaid }, enforceExpiry);
    }
    async getOrderItem(orderID, itemIndex) {
        return await _getOrderItem(this.#config, orderID, itemIndex);
    }
    async getOrderNumberBySecret(orderSecret) {
        return await _getOrderNumberBySecret(this.#config, orderSecret);
    }
    async getOrders(filters) {
        return await _getOrders(this.#config, filters);
    }
    async isOrderFoundAndPaid(orderNumber, orderSecret) {
        return await _isOrderFoundAndPaid(this.#config, orderNumber, orderSecret);
    }
}
