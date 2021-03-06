import type { Order } from "./types";
export interface GetOrderFilters {
    productSKUs?: string[];
    orderIsPaid?: 0 | 1;
    orderIsRefunded?: 0 | 1;
    orderTimeMaxAgeDays?: number;
}
export declare const getOrders: (filters: GetOrderFilters) => Promise<Order[]>;
