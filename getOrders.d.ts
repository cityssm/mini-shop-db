import type { MiniShopConfig, Order } from "./types";
export interface GetOrderFilters {
    productSKUs?: string[];
    orderIsPaid?: 0 | 1;
    orderIsRefunded?: 0 | 1;
    itemIsAcknowledged?: 0 | 1;
    orderTimeMaxAgeDays?: number;
}
export declare const _getOrders: (config: MiniShopConfig, filters: GetOrderFilters) => Promise<Order[]>;
export default _getOrders;
