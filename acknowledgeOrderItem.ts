import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as sql from "mssql";
import * as config from "./config";


export const acknowledgeOrderItem = async (orderID: number | string, itemIndex: number | string, acknowledgeValues: {
  acknowledgedUser: string;
  acknowledgedTime?: Date;
}) => {

  try {
    const pool: sql.ConnectionPool =
      await sqlPool.connect(config.getMSSQLConfig());

    const result = await pool.request()
      .input("acknowledgedUser", acknowledgeValues.acknowledgedUser)
      .input("acknowledgedTime",
        acknowledgeValues.hasOwnProperty("acknowledgedTime") ? acknowledgeValues.acknowledgedTime : new Date())
      .input("orderID", orderID)
      .input("itemIndex", itemIndex)
      .query("update MiniShop.OrderItems" +
        " set acknowledgedUser = @acknowledgedUser," +
        " acknowledgedTime = @acknowledgedTime" +
        " where orderID = @orderID" +
        " and itemIndex = @itemIndex");

    return result.rowsAffected[0] === 1;

  } catch (e) {
    config.logger.error(e);
  }

  return false;
};
