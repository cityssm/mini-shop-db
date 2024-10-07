import type { MiniShopConfig } from '../types.js';
export interface DeleteDetails {
    deleteUser: string;
    deleteReason: string;
}
/**
 * Deletes an order.
 * @param config - MSSQL config
 * @param orderID - Order ID
 * @param deleteDetails - Deleting user and reason
 * @returns `true` if successful
 */
export default function _deleteOrder(config: MiniShopConfig, orderID: number, deleteDetails: DeleteDetails): Promise<boolean>;
