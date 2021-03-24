"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFee = exports.setFee = exports.getFees = exports.setFees = exports.getProduct = exports.setProduct = exports.getProducts = exports.setProducts = exports.getOrderNumberFunction = exports.setOrderNumberFunction = exports.getMSSQLConfig = exports.setMSSQLConfig = void 0;
let _mssqlConfig = null;
function setMSSQLConfig(mssqlConfig) {
    _mssqlConfig = mssqlConfig;
}
exports.setMSSQLConfig = setMSSQLConfig;
function getMSSQLConfig() {
    return _mssqlConfig;
}
exports.getMSSQLConfig = getMSSQLConfig;
let _orderNumberFunction = null;
function setOrderNumberFunction(orderNumberFunction) {
    _orderNumberFunction = orderNumberFunction;
}
exports.setOrderNumberFunction = setOrderNumberFunction;
function getOrderNumberFunction() {
    return _orderNumberFunction;
}
exports.getOrderNumberFunction = getOrderNumberFunction;
let _products = {};
function setProducts(products) {
    _products = products;
}
exports.setProducts = setProducts;
function getProducts() {
    return _products;
}
exports.getProducts = getProducts;
function setProduct(productSKU, product) {
    _products[productSKU] = product;
}
exports.setProduct = setProduct;
function getProduct(productSKU) {
    return _products[productSKU];
}
exports.getProduct = getProduct;
let _fees = {};
function setFees(fees) {
    _fees = fees;
}
exports.setFees = setFees;
function getFees() {
    return _fees;
}
exports.getFees = getFees;
function setFee(feeName, fee) {
    _fees[feeName] = fee;
}
exports.setFee = setFee;
function getFee(feeName) {
    return _fees[feeName];
}
exports.getFee = getFee;
