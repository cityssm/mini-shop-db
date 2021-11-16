import * as sqlPool from "@cityssm/mssql-multi-pool";

import type { MiniShopConfig, OrderItem } from "./types";

import debug from "debug";
const debugSQL = debug("mini-shop-db:getOrderItem");


export const _getOrderItem = async (config: MiniShopConfig,
  orderID: number | string, itemIndex: number | string) => {

  try {
    const pool = await sqlPool.connect(config.mssqlConfig);

    const orderItemResult = await pool.request()
      .input("orderID", orderID)
      .input("itemIndex", itemIndex)
      .query("select itemIndex, productSKU, unitPrice, quantity, itemTotal" +
        " from MiniShop.OrderItems" +
        " where orderID = @orderID" +
        " and itemIndex = @itemIndex" +
        " and orderID in (select orderID from MiniShop.Orders where orderIsDeleted = 0)");

    if (!orderItemResult.recordset || orderItemResult.recordset.length === 0) {
      return false;
    }

    const item = orderItemResult.recordset[0] as OrderItem;

    const fieldsResult = await pool.request()
      .input("orderID", orderID)
      .input("itemIndex", itemIndex)
      .query("select formFieldName, fieldValue" +
        " from MiniShop.OrderItemFields" +
        " where orderID = @orderID" +
        " and itemIndex = @itemIndex");

    item.fields = fieldsResult.recordset;

    return item;

  } catch (error) {
    debugSQL(error);
  }

  return false;
};


export default _getOrderItem;
