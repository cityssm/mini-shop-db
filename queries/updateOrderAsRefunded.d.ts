import type { MiniShopConfig } from '../types.js';
export interface RefundDetails {
    refundID: string;
    refundUser: string;
    refundReason: string;
}
export default function _updateOrderAsRefunded(config: MiniShopConfig, orderNumber: string, orderSecret: string, refundDetails: RefundDetails): Promise<boolean>;
