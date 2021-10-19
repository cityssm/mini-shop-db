import type { MiniShopConfig, OrderItem } from "./types";
export declare const _getOrderItem: (config: MiniShopConfig, orderID: number | string, itemIndex: number | string) => Promise<false | OrderItem>;
export default _getOrderItem;
