import type { config as MSSQLConfig } from "mssql";
export interface MiniShopConfig {
    mssqlConfig?: MSSQLConfig;
    orderNumberFunction?: () => string;
    products?: {
        [productSKU: string]: Product;
    };
    fees?: {
        [feeName: string]: Fee;
    };
}
export interface ShippingForm {
    fullName: string;
    address: string;
    address2?: string;
    city: string;
    province: string;
    country?: string;
    postalCode: string;
    phoneNumberDay: string;
    phoneNumberEvening?: string;
    emailAddress: string;
    redirectURL?: string;
    cartItems: CartItem[];
}
export interface CartItem {
    productSKU: string;
    quantity: string;
    unitPrice: string;
    [formFieldName: string]: string;
}
export interface Order {
    orderID: number;
    orderNumber: string;
    orderSecret?: string;
    orderTime: Date;
    shippingName: string;
    shippingAddress1: string;
    shippingAddress2?: string;
    shippingCity: string;
    shippingProvince: string;
    shippingCountry: string;
    shippingPostalCode: string;
    shippingPhoneNumberDay: string;
    shippingPhoneNumberEvening?: string;
    shippingEmailAddress: string;
    paymentID?: string;
    paymentTime?: Date;
    orderIsPaid: boolean;
    refundID?: string;
    refundTime?: Date;
    refundUser?: string;
    refundReason?: string;
    orderIsRefunded: boolean;
    redirectURL?: string;
    items?: OrderItem[];
    fees?: Array<{
        feeName: string;
        feeTotal: number;
    }>;
    paymentData?: Array<{
        dataName: string;
        dataValue: string;
    }>;
}
export interface OrderItem {
    orderID?: number;
    itemIndex: number;
    productSKU: string;
    unitPrice: number;
    quantity: number;
    itemTotal: number;
    fields?: OrderItemField[];
    acknowledgedTime?: Date;
    acknowledgedUser?: string;
    itemIsAcknowledged: boolean;
}
export interface OrderItemField {
    itemIndex?: number;
    formFieldName: string;
    fieldValue: string;
}
export interface Product {
    productSKU?: string;
    productName?: string;
    price: number | "form";
    formFieldsToSave?: Array<{
        fieldName?: string;
        formFieldName: string;
    }>;
    fees?: string[];
    feeTotals?: {
        [feeName: string]: number;
    };
}
export interface Fee {
    feeSKU?: string;
    feeName: string;
    feeCalculation: (product: Product) => number;
}
export declare type StoreValidatorErrorMessage = "noHandler" | "noResult" | "missingOrderNumber" | "invalidOrderNumber" | "missingOrderSecret" | "paymentDeclined";
export declare type StoreValidatorReturn = {
    isValid: true;
    orderNumber: string;
    orderSecret: string;
    paymentID: string;
    paymentData?: {
        [dataName: string]: string;
    };
} | {
    isValid: false;
    errorCode: StoreValidatorErrorMessage;
};
