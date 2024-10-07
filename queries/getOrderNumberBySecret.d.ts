import type { MiniShopConfig } from '../types';
/**
 * Retrieves an order number from a given order secret.
 * @param config - MSSQL config
 * @param orderSecret - Order secret
 * @returns The order number if avaialble.
 */
export default function _getOrderNumberBySecret(config: MiniShopConfig, orderSecret: string): Promise<string | undefined>;
