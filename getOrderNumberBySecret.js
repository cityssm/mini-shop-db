import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as sql from "mssql";
import * as config from "./config.js";
import debug from "debug";
const debugSQL = debug("mini-shop-db:getOrderNumberBySecret");
export const getOrderNumberBySecret = async (orderSecret) => {
    try {
        const pool = await sqlPool.connect(config.getMSSQLConfig());
        const orderResult = await pool.request()
            .input("orderSecret", sql.UniqueIdentifier, orderSecret)
            .query("select orderNumber" +
            " from MiniShop.Orders" +
            " where orderIsRefunded = 0 and orderIsDeleted = 0" +
            " and orderSecret = @orderSecret");
        if (!orderResult.recordset || orderResult.recordset.length === 0) {
            return false;
        }
        return orderResult.recordset[0].orderNumber;
    }
    catch (e) {
        debugSQL(e);
    }
    return false;
};
