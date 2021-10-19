import type { MiniShopConfig } from "./types";
export declare const _isOrderFoundAndPaid: (config: MiniShopConfig, orderNumber: string, orderSecret: string) => Promise<{
    found: boolean;
    paid: boolean;
    orderID?: number;
}>;
export default _isOrderFoundAndPaid;
