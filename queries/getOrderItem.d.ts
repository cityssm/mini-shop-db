import type { MiniShopConfig, OrderItem } from '../types';
export default function _getOrderItem(config: MiniShopConfig, orderID: number | string, itemIndex: number | string): Promise<OrderItem | undefined>;
