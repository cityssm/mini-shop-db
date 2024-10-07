import type { MiniShopConfig, Order } from '../types';
export default function _getOrder(config: MiniShopConfig, orderDetails: {
    orderNumber: string;
    orderSecret: string;
    orderIsPaid: boolean;
}, enforceExpiry?: boolean): Promise<Order | undefined>;
