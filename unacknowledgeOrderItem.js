import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as config from "./config.js";
import { debug } from "debug";
const debugSQL = debug("mini-shop-db:unacknowledgeOrderItem");
export const unacknowledgeOrderItem = async (orderID, itemIndex) => {
    try {
        const pool = await sqlPool.connect(config.getMSSQLConfig());
        const result = await pool.request()
            .input("orderID", orderID)
            .input("itemIndex", itemIndex)
            .query("update MiniShop.OrderItems" +
            " set acknowledgedUser = null," +
            " acknowledgedTime = null" +
            " where orderID = @orderID" +
            " and itemIndex = @itemIndex");
        return result.rowsAffected[0] === 1;
    }
    catch (e) {
        debugSQL(e);
    }
    return false;
};
