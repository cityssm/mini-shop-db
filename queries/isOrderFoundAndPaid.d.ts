import type { MiniShopConfig } from '../types.js';
export type IsOrderFoundAndPaidReturn = {
    found: true;
    paid: boolean;
    orderID: number;
} | {
    found: false;
    paid: false;
};
/**
 * Retrieves the existence and status of a given order.
 * @param config - MSSQL config
 * @param orderNumber - Order number
 * @param orderSecret - Order secret
 * @returns the status of the order
 */
export default function _isOrderFoundAndPaid(config: MiniShopConfig, orderNumber: string, orderSecret: string): Promise<IsOrderFoundAndPaidReturn>;
