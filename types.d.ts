export interface ShippingForm {
    fullName: string;
    address: string;
    address2: string;
    city: string;
    province: string;
    country: string;
    postalCode: string;
    phoneNumberDay: string;
    phoneNumberEvening: string;
    emailAddress: string;
    redirectURL?: string;
    cartItems: CartItem[];
}
export interface CartItem {
    productSKU: string;
    quantity: string;
    [formFieldName: string]: string;
}
export interface Order {
    orderID: number;
    orderNumber: string;
    orderSecret: string;
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
    redirectURL?: string;
    items?: Array<{
        itemIndex: number;
        productSKU: string;
        unitPrice: number;
        quantity: number;
        itemTotal: number;
    }>;
    fees?: Array<{
        feeName: string;
        feeTotal: number;
    }>;
    paymentData?: Array<{
        dataName: string;
        dataValue: string;
    }>;
}
export interface Product {
    productName: string;
    price: number;
    formFieldsToSave?: Array<{
        fieldName: string;
        formFieldName: string;
    }>;
    fees?: string[];
    feeTotals?: {
        [feeName: string]: number;
    };
}
export interface Fee {
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
