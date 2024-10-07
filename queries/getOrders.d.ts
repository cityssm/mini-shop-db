import type { MiniShopConfig, Order } from '../types';
export interface GetOrderFilters {
    productSKUs: string[];
    orderIsPaid: 0 | 1;
    orderIsRefunded: 0 | 1;
    itemIsAcknowledged: 0 | 1;
    orderTimeMaxAgeDays: number;
}
export default function _getOrders(config: MiniShopConfig, filters: Partial<GetOrderFilters>): Promise<Order[]>;
