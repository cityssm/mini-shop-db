import { type CreateOrderReturn } from './queries/createOrder.js';
import { type DeleteDetails } from './queries/deleteOrder.js';
import { type GetOrderFilters } from './queries/getOrders.js';
import { type IsOrderFoundAndPaidReturn } from './queries/isOrderFoundAndPaid.js';
import { type RefundDetails } from './queries/updateOrderAsRefunded.js';
import type * as types from './types.js';
export default class MiniShopDB {
    #private;
    constructor(miniShopConfig: types.MiniShopConfig);
    acknowledgeOrderItem(orderID: number | string, itemIndex: number | string, acknowledgeValues: {
        acknowledgedUser: string;
        acknowledgedTime?: Date;
    }): Promise<boolean>;
    createOrder(shippingForm: Partial<types.ShippingForm>): Promise<CreateOrderReturn>;
    deleteOrder(orderID: number, deleteDetails: DeleteDetails): Promise<boolean>;
    unacknowledgeOrderItem(orderID: number | string, itemIndex: number | string): Promise<boolean>;
    updateOrderAsPaid(validOrder: types.StoreValidatorReturn): Promise<boolean>;
    updateOrderAsRefunded(orderNumber: string, orderSecret: string, refundDetails: RefundDetails): Promise<boolean>;
    getOrder(orderNumber: string, orderSecret: string, orderIsPaid: boolean, enforceExpiry?: boolean): Promise<types.Order | undefined>;
    getOrderItem(orderID: number | string, itemIndex: number | string): Promise<types.OrderItem | undefined>;
    getOrderNumberBySecret(orderSecret: string): Promise<string | undefined>;
    getOrders(filters: GetOrderFilters): Promise<types.Order[]>;
    isOrderFoundAndPaid(orderNumber: string, orderSecret: string): Promise<IsOrderFoundAndPaidReturn>;
}
