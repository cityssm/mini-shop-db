import type { OrderItem } from "./types";
export declare const getOrderItem: (orderID: number | string, itemIndex: number | string) => Promise<false | OrderItem>;
