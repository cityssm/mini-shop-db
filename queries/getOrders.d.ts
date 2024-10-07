import type { MiniShopConfig, Order } from '../types';
type ZeroOrOne = 0 | 1;
export interface GetOrderFilters {
    productSKUs: string[];
    orderIsPaid: ZeroOrOne;
    orderIsRefunded: ZeroOrOne;
    itemIsAcknowledged: ZeroOrOne;
    orderTimeMaxAgeDays: number;
}
/**
 * Retrieves a list of orders.
 * @param config - MSSQL config
 * @param filters - Search filters
 * @returns An array of orders
 */
export default function _getOrders(config: MiniShopConfig, filters: Partial<GetOrderFilters>): Promise<Order[]>;
export {};
