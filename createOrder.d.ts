import type { MiniShopConfig, ShippingForm } from "./types";
declare type CreateOrderReturn = {
    success: true;
    orderNumber: string;
    orderSecret: string;
    orderTime: Date;
} | {
    success: false;
};
export declare const _createOrder: (config: MiniShopConfig, shippingForm: ShippingForm) => Promise<CreateOrderReturn>;
export default _createOrder;
