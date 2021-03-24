import type { config as MSSQLConfig } from "mssql";
import type * as types from "./types";


/*
 * MSSQL Config
 */


let _mssqlConfig: MSSQLConfig = null;


export function setMSSQLConfig(mssqlConfig: MSSQLConfig) {
  _mssqlConfig = mssqlConfig;
}


export function getMSSQLConfig() {
  return _mssqlConfig;
}


/*
 * Order Number Function
 */


let _orderNumberFunction: () => string = null;


export function setOrderNumberFunction(orderNumberFunction: () => string) {
  _orderNumberFunction = orderNumberFunction;
}


export function getOrderNumberFunction() {
  return _orderNumberFunction;
}


/*
 * Products
 */


let _products: { [productSKU: string]: types.Product } = {};


export function setProducts(products: { [productSKU: string]: types.Product }) {
  _products = products;
}


export function getProducts() {
  return _products;
}


export function setProduct(productSKU: string, product: types.Product) {
  _products[productSKU] = product;
}


export function getProduct(productSKU: string) {
  return _products[productSKU];
}


/*
 * Fees
 */


let _fees: { [feeName: string]: types.Fee } = {};


export function setFees(fees: { [feeName: string]: types.Fee }) {
  _fees = fees;
}


export function getFees() {
  return _fees;
}


export function setFee(feeName: string, fee: types.Fee) {
  _fees[feeName] = fee;
}


export function getFee(feeName: string) {
  return _fees[feeName];
}
