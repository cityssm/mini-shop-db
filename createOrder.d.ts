import * as sql from "mssql";
import type { ShippingForm, CartItem } from "./types";
declare type CreateOrderReturn = {
    success: true;
    orderNumber: string;
    orderSecret: string;
    orderTime: Date;
} | {
    success: false;
};
export declare const insertOrderItem: (pool: sql.ConnectionPool, orderID: number, cartIndex: number, cartItem: CartItem) => Promise<void>;
export declare const createOrder: (shippingForm: ShippingForm) => Promise<CreateOrderReturn>;
export {};
