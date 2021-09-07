let _mssqlConfig = null;
export function setMSSQLConfig(mssqlConfig) {
    _mssqlConfig = mssqlConfig;
}
export function getMSSQLConfig() {
    return _mssqlConfig;
}
let _orderNumberFunction = null;
export function setOrderNumberFunction(orderNumberFunction) {
    _orderNumberFunction = orderNumberFunction;
}
export function getOrderNumberFunction() {
    return _orderNumberFunction;
}
let _products = {};
export function setProducts(products) {
    _products = products;
}
export function getProducts() {
    return _products;
}
export function setProduct(productSKU, product) {
    _products[productSKU] = product;
}
export function getProduct(productSKU) {
    return _products[productSKU];
}
let _fees = {};
export function setFees(fees) {
    _fees = fees;
}
export function getFees() {
    return _fees;
}
export function setFee(feeName, fee) {
    _fees[feeName] = fee;
}
export function getFee(feeName) {
    return _fees[feeName];
}
