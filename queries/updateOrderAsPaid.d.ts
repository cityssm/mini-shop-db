import type { MiniShopConfig, StoreValidatorReturn } from '../types.js';
/**
 * Updates an order with paid.
 * @param config - MSSQL config
 * @param validOrder - A valid order
 * @returns `true` when the order is marked as paid
 */
export default function _updateOrderAsPaid(config: MiniShopConfig, validOrder: StoreValidatorReturn): Promise<boolean>;
