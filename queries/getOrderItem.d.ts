import type { MiniShopConfig, OrderItem } from '../types';
/**
 * Retrieves an order item record.
 * @param config - MSSQL config
 * @param orderID - Order ID
 * @param itemIndex - Item index
 * @returns Order item record if available
 */
export default function _getOrderItem(config: MiniShopConfig, orderID: number | string, itemIndex: number | string): Promise<OrderItem | undefined>;
