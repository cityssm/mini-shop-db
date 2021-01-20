import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as sql from "mssql";
import * as config from "./config";


import type { OrderItem } from "./types";


export const getOrderItem = async (orderID: number | string, itemIndex: number | string) => {

  try {
    const pool: sql.ConnectionPool =
      await sqlPool.connect(config.getMSSQLConfig());

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
      .input("orderID", sql.BigInt, orderID)
      .input("itemIndex", itemIndex)
      .query("select formFieldName, fieldValue" +
        " from MiniShop.OrderItemFields" +
        " where orderID = @orderID" +
        " and itemIndex = @itemIndex");

    item.fields = fieldsResult.recordset;

    return item;

  } catch (e) {
    config.logger.error(e);
  }

  return false;
};
