import type { MiniShopConfig } from "./types";
export interface DeleteDetails {
    deleteUser: string;
    deleteReason: string;
}
export declare const _deleteOrder: (config: MiniShopConfig, orderID: number, deleteDetails: DeleteDetails) => Promise<boolean>;
