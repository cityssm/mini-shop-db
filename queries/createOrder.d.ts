import type { MiniShopConfig, ShippingForm } from '../types.js';
export type CreateOrderReturn = {
    success: true;
    orderNumber: string;
    orderSecret: string;
    orderTime: Date;
} | {
    success: false;
};
export default function _createOrder(config: MiniShopConfig, shippingForm: Partial<ShippingForm>): Promise<CreateOrderReturn>;
