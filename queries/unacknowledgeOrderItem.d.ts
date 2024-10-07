import type { MiniShopConfig } from '../types.js';
/**
 * Unacknowledges a given order item.
 * @param config - MSSQL config
 * @param orderID - Order ID
 * @param itemIndex - Item index
 * @returns `true` when successful
 */
export default function _unacknowledgeOrderItem(config: MiniShopConfig, orderID: number | string, itemIndex: number | string): Promise<boolean>;
