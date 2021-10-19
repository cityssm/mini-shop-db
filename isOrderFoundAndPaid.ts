import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as sql from "mssql";

import type { MiniShopConfig } from "./types";

import debug from "debug";
const debugSQL = debug("mini-shop-db:isOrderFoundAndPaid");


export const _isOrderFoundAndPaid = async (config: MiniShopConfig,
  orderNumber: string, orderSecret: string): Promise<{
  found: boolean; paid: boolean; orderID?: number;
}> => {

  try {
    const pool: sql.ConnectionPool =
      await sqlPool.connect(config.mssqlConfig);

    const orderResult = await pool.request()
      .input("orderNumber", orderNumber)
      .input("orderSecret", orderSecret)
      .query("select orderID, orderIsPaid from MiniShop.Orders" +
        " where orderIsRefunded = 0 and orderIsDeleted = 0" +
        " and orderNumber = @orderNumber" +
        " and orderSecret = @orderSecret");

    if (orderResult.recordset && orderResult.recordset.length === 1) {

      const order: {
        orderID: number;
        orderIsPaid: boolean;
      } = orderResult.recordset[0];

      return {
        found: true,
        orderID: order.orderID,
        paid: order.orderIsPaid
      };
    }

  } catch (error) {
    debugSQL(error);
  }

  return {
    found: false,
    paid: false
  };
};


export default _isOrderFoundAndPaid;
