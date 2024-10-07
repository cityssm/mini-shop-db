import type { MiniShopConfig } from '../types.js';
/**
 * Acknowledges an order item.
 * @param config - MSSQL config
 * @param orderID - Order ID
 * @param itemIndex - Item Index
 * @param acknowledgeValues - Acknowledge user and time
 * @param acknowledgeValues.acknowledgedUser - Acknowledge user
 * @param acknowledgeValues.acknowledgedTime - Acknowledge time
 * @returns `true` if successful
 */
export default function _acknowledgeOrderItem(config: MiniShopConfig, orderID: number | string, itemIndex: number | string, acknowledgeValues: {
    acknowledgedUser: string;
    acknowledgedTime?: Date;
}): Promise<boolean>;
