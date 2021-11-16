import * as sqlPool from "@cityssm/mssql-multi-pool";

import type { MiniShopConfig } from "./types";

import debug from "debug";
const debugSQL = debug("mini-shop-db:unacknowledgeOrderItem");


export const _unacknowledgeOrderItem = async (config: MiniShopConfig,
  orderID: number | string, itemIndex: number | string) => {

  try {
    const pool = await sqlPool.connect(config.mssqlConfig);

    const result = await pool.request()
      .input("orderID", orderID)
      .input("itemIndex", itemIndex)
      .query("update MiniShop.OrderItems" +
        " set acknowledgedUser = null," +
        " acknowledgedTime = null" +
        " where orderID = @orderID" +
        " and itemIndex = @itemIndex");

    return result.rowsAffected[0] === 1;

  } catch (error) {
    debugSQL(error);
  }

  return false;
};


export default _unacknowledgeOrderItem;
