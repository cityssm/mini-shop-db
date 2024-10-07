import type { MiniShopConfig, Order } from '../types.js';
/**
 * Retrieves an order record.
 * @param config - MSSQL config
 * @param orderDetails - Order details
 * @param orderDetails.orderNumber - The order number
 * @param orderDetails.orderSecret - The order secret
 * @param orderDetails.orderIsPaid - Whether the order is paid
 * @param enforceExpiry - When `true`, older orders will be restricted
 * @returns An order record when available
 */
export default function _getOrder(config: MiniShopConfig, orderDetails: {
    orderNumber: string;
    orderSecret: string;
    orderIsPaid: boolean;
}, enforceExpiry?: boolean): Promise<Order | undefined>;
