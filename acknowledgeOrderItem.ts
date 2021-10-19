import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as sql from "mssql";

import type { MiniShopConfig } from "./types.js";

import debug from "debug";
const debugSQL = debug("mini-shop-db:acknowledgeOrderItem");


export const _acknowledgeOrderItem = async (config: MiniShopConfig,
  orderID: number | string, itemIndex: number | string, acknowledgeValues: {
  acknowledgedUser: string;
  acknowledgedTime?: Date;
}) => {

  try {
    const pool: sql.ConnectionPool =
      await sqlPool.connect(config.mssqlConfig);

    const result = await pool.request()
      .input("acknowledgedUser", acknowledgeValues.acknowledgedUser)
      .input("acknowledgedTime",
        Object.prototype.hasOwnProperty.call(acknowledgeValues, "acknowledgedTime") ? acknowledgeValues.acknowledgedTime : new Date())
      .input("orderID", orderID)
      .input("itemIndex", itemIndex)
      .query("update MiniShop.OrderItems" +
        " set acknowledgedUser = @acknowledgedUser," +
        " acknowledgedTime = @acknowledgedTime" +
        " where orderID = @orderID" +
        " and itemIndex = @itemIndex");

    return result.rowsAffected[0] === 1;

  } catch (error) {
    debugSQL(error);
  }

  return false;
};


export default _acknowledgeOrderItem;
