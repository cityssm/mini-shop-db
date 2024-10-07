import type { MiniShopConfig, Order } from '../types.js';
export default function _getOrder(config: MiniShopConfig, orderDetails: {
    orderNumber: string;
    orderSecret: string;
    orderIsPaid: boolean;
}, enforceExpiry?: boolean): Promise<Order | undefined>;
