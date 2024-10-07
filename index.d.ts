import { type CreateOrderReturn } from './queries/createOrder.js';
import { type DeleteDetails } from './queries/deleteOrder.js';
import { type GetOrderFilters } from './queries/getOrders.js';
import { type IsOrderFoundAndPaidReturn } from './queries/isOrderFoundAndPaid.js';
import { type RefundDetails } from './queries/updateOrderAsRefunded.js';
import type { MiniShopConfig, Order, OrderItem, ShippingForm, StoreValidatorReturn } from './types.js';
export default class MiniShopDB {
    #private;
    constructor(miniShopConfig: MiniShopConfig);
    acknowledgeOrderItem(orderID: number | string, itemIndex: number | string, acknowledgeValues: {
        acknowledgedUser: string;
        acknowledgedTime?: Date;
    }): Promise<boolean>;
    createOrder(shippingForm: Partial<ShippingForm>): Promise<CreateOrderReturn>;
    deleteOrder(orderID: number, deleteDetails: DeleteDetails): Promise<boolean>;
    unacknowledgeOrderItem(orderID: number | string, itemIndex: number | string): Promise<boolean>;
    updateOrderAsPaid(validOrder: StoreValidatorReturn): Promise<boolean>;
    updateOrderAsRefunded(orderNumber: string, orderSecret: string, refundDetails: RefundDetails): Promise<boolean>;
    getOrder(orderNumber: string, orderSecret: string, orderIsPaid: boolean, enforceExpiry?: boolean): Promise<Order | undefined>;
    getOrderItem(orderID: number | string, itemIndex: number | string): Promise<OrderItem | undefined>;
    getOrderNumberBySecret(orderSecret: string): Promise<string | undefined>;
    getOrders(filters: Partial<GetOrderFilters>): Promise<types.Order[]>;
    isOrderFoundAndPaid(orderNumber: string, orderSecret: string): Promise<IsOrderFoundAndPaidReturn>;
}
export type * as types from './types.js';
