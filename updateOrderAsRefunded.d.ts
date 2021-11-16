import type { MiniShopConfig } from "./types";
export interface RefundDetails {
    refundID: string;
    refundUser: string;
    refundReason: string;
}
export declare const _updateOrderAsRefunded: (config: MiniShopConfig, orderNumber: string, orderSecret: string, refundDetails: RefundDetails) => Promise<boolean>;
