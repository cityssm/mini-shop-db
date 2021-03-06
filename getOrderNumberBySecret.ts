import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as sql from "mssql";
import * as config from "./config";

import { debug } from "debug";
const debugSQL = debug("mini-shop-db:getOrderNumberBySecret");


export const getOrderNumberBySecret = async (orderSecret: string) => {

  try {
    const pool: sql.ConnectionPool =
      await sqlPool.connect(config.getMSSQLConfig());

    // Get the order record

    const orderResult = await pool.request()
      .input("orderSecret", sql.UniqueIdentifier, orderSecret)
      .query("select orderNumber" +
        " from MiniShop.Orders" +
        " where orderIsRefunded = 0 and orderIsDeleted = 0" +
        " and orderSecret = @orderSecret");

    if (!orderResult.recordset || orderResult.recordset.length === 0) {
      return false;
    }

    return orderResult.recordset[0].orderNumber as string;

  } catch (e) {
    debugSQL(e);
  }

  return false;
};
