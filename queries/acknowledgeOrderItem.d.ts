import type { MiniShopConfig } from '../types.js';
export default function _acknowledgeOrderItem(config: MiniShopConfig, orderID: number | string, itemIndex: number | string, acknowledgeValues: {
    acknowledgedUser: string;
    acknowledgedTime?: Date;
}): Promise<boolean>;
