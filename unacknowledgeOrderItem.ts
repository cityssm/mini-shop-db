import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as sql from "mssql";
import * as config from "./config";

import { debug } from "debug";
const debugSQL = debug("mini-shop-db:unacknowledgeOrderItem");


export const unacknowledgeOrderItem = async (orderID: number | string, itemIndex: number | string) => {

  try {
    const pool: sql.ConnectionPool =
      await sqlPool.connect(config.getMSSQLConfig());

    const result = await pool.request()
      .input("orderID", orderID)
      .input("itemIndex", itemIndex)
      .query("update MiniShop.OrderItems" +
        " set acknowledgedUser = null," +
        " acknowledgedTime = null" +
        " where orderID = @orderID" +
        " and itemIndex = @itemIndex");

    return result.rowsAffected[0] === 1;

  } catch (e) {
    debugSQL(e);
  }

  return false;
};
