import type { config as MSSQLConfig } from "mssql";
import type * as types from "./types";
export declare function setMSSQLConfig(mssqlConfig: MSSQLConfig): void;
export declare function getMSSQLConfig(): MSSQLConfig;
export declare function setOrderNumberFunction(orderNumberFunction: () => string): void;
export declare function getOrderNumberFunction(): () => string;
export declare function setProducts(products: {
    [productSKU: string]: types.Product;
}): void;
export declare function getProducts(): {
    [productSKU: string]: types.Product;
};
export declare function setProduct(productSKU: string, product: types.Product): void;
export declare function getProduct(productSKU: string): types.Product;
export declare function setFees(fees: {
    [feeName: string]: types.Fee;
}): void;
export declare function getFees(): {
    [feeName: string]: types.Fee;
};
export declare function setFee(feeName: string, fee: types.Fee): void;
export declare function getFee(feeName: string): types.Fee;
