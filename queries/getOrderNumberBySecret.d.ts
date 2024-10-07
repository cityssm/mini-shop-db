import type { MiniShopConfig } from '../types';
export default function _getOrderNumberBySecret(config: MiniShopConfig, orderSecret: string): Promise<string | undefined>;
