import type * as types from "./types";
import type { config as MSSQLConfig } from "mssql";
export declare const setConfig: (miniShopConfig: types.MiniShopConfig) => void;
export declare const setMSSQLConfig: (mssqlConfig: MSSQLConfig) => void;
export declare const setOrderNumberFunction: (orderNumberFunction: () => string) => void;
export declare const setFees: (fees: {
    [feeName: string]: types.Fee;
}) => void;
export declare const acknowledgeOrderItem: (orderID: number | string, itemIndex: number | string, acknowledgeValues: {
    acknowledgedUser: string;
    acknowledgedTime?: Date;
}) => Promise<boolean>;
export declare const createOrder: (shippingForm: types.ShippingForm) => Promise<{
    success: true;
    orderNumber: string;
    orderSecret: string;
    orderTime: Date;
} | {
    success: false;
}>;
import { DeleteDetails } from "./deleteOrder.js";
export declare const deleteOrder: (orderID: number, deleteDetails: DeleteDetails) => Promise<boolean>;
export declare const unacknowledgeOrderItem: (orderID: number | string, itemIndex: number | string) => Promise<boolean>;
export declare const updateOrderAsPaid: (validOrder: types.StoreValidatorReturn) => Promise<boolean>;
import { RefundDetails } from "./updateOrderAsRefunded.js";
export declare const updateOrderAsRefunded: (orderNumber: string, orderSecret: string, refundDetails: RefundDetails) => Promise<boolean>;
export declare const getOrder: (orderNumber: string, orderSecret: string, orderIsPaid: boolean, enforceExpiry?: boolean) => Promise<false | types.Order>;
export declare const getOrderItem: (orderID: number | string, itemIndex: number | string) => Promise<false | types.OrderItem>;
export declare const getOrderNumberBySecret: (orderSecret: string) => Promise<string | false>;
import { GetOrderFilters } from "./getOrders.js";
export declare const getOrders: (filters: GetOrderFilters) => Promise<types.Order[]>;
export declare const isOrderFoundAndPaid: (orderNumber: string, orderSecret: string) => Promise<{
    found: boolean;
    paid: boolean;
    orderID?: number;
}>;
export declare const releaseAll: () => void;
