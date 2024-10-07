import type { MiniShopConfig } from '../types.js';
export type IsOrderFoundAndPaidReturn = {
    found: true;
    paid: boolean;
    orderID: number;
} | {
    found: false;
    paid: false;
};
export default function _isOrderFoundAndPaid(config: MiniShopConfig, orderNumber: string, orderSecret: string): Promise<IsOrderFoundAndPaidReturn>;
