import type { MiniShopConfig } from '../types.js';
export interface RefundDetails {
    refundID: string;
    refundUser: string;
    refundReason: string;
}
/**
 * Updates an order as refunded.
 * @param config - MSSQL config
 * @param orderNumber - The order number
 * @param orderSecret - The order secret
 * @param refundDetails - The refund details
 * @returns `true` when an order is marked as refunded
 */
export default function _updateOrderAsRefunded(config: MiniShopConfig, orderNumber: string, orderSecret: string, refundDetails: RefundDetails): Promise<boolean>;
