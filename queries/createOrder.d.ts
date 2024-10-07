import type { MiniShopConfig, ShippingForm } from '../types.js';
export type CreateOrderReturn = {
    success: true;
    orderNumber: string;
    orderSecret: string;
    orderTime: Date;
} | {
    success: false;
};
/**
 * Creates a new Order record.
 * @param config - MSSQL donfig
 * @param shippingForm - Shipping form
 * @returns Create result
 */
export default function _createOrder(config: MiniShopConfig, shippingForm: Partial<ShippingForm>): Promise<CreateOrderReturn>;
