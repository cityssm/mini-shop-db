import type { MiniShopConfig, Order } from "./types";
export declare const _getOrder: (config: MiniShopConfig, orderNumber: string, orderSecret: string, orderIsPaid: boolean, enforceExpiry?: boolean) => Promise<false | Order>;
export default _getOrder;
