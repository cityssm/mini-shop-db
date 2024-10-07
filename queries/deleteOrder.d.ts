import type { MiniShopConfig } from '../types.js';
export interface DeleteDetails {
    deleteUser: string;
    deleteReason: string;
}
export default function _deleteOrder(config: MiniShopConfig, orderID: number, deleteDetails: DeleteDetails): Promise<boolean>;
