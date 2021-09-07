import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as config from "./config.js";
import { debug } from "debug";
const debugSQL = debug("mini-shop-db:acknowledgeOrderItem");
export const acknowledgeOrderItem = async (orderID, itemIndex, acknowledgeValues) => {
    try {
        const pool = await sqlPool.connect(config.getMSSQLConfig());
        const result = await pool.request()
            .input("acknowledgedUser", acknowledgeValues.acknowledgedUser)
            .input("acknowledgedTime", acknowledgeValues.hasOwnProperty("acknowledgedTime") ? acknowledgeValues.acknowledgedTime : new Date())
            .input("orderID", orderID)
            .input("itemIndex", itemIndex)
            .query("update MiniShop.OrderItems" +
            " set acknowledgedUser = @acknowledgedUser," +
            " acknowledgedTime = @acknowledgedTime" +
            " where orderID = @orderID" +
            " and itemIndex = @itemIndex");
        return result.rowsAffected[0] === 1;
    }
    catch (e) {
        debugSQL(e);
    }
    return false;
};
