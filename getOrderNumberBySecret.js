import * as sqlPool from "@cityssm/mssql-multi-pool";
import debug from "debug";
const debugSQL = debug("mini-shop-db:getOrderNumberBySecret");
export const _getOrderNumberBySecret = async (config, orderSecret) => {
    try {
        const pool = await sqlPool.connect(config.mssqlConfig);
        const orderResult = await pool.request()
            .input("orderSecret", orderSecret)
            .query("select orderNumber" +
            " from MiniShop.Orders" +
            " where orderIsRefunded = 0 and orderIsDeleted = 0" +
            " and orderSecret = @orderSecret");
        if (!orderResult.recordset || orderResult.recordset.length === 0) {
            return false;
        }
        return orderResult.recordset[0].orderNumber;
    }
    catch (error) {
        debugSQL(error);
    }
    return false;
};
export default _getOrderNumberBySecret;
