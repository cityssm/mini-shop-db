import * as sqlPool from "@cityssm/mssql-multi-pool";
import debug from "debug";
const debugSQL = debug("mini-shop-db:isOrderFoundAndPaid");
export const _isOrderFoundAndPaid = async (config, orderNumber, orderSecret) => {
    try {
        const pool = await sqlPool.connect(config.mssqlConfig);
        const orderResult = await pool.request()
            .input("orderNumber", orderNumber)
            .input("orderSecret", orderSecret)
            .query("select orderID, orderIsPaid from MiniShop.Orders" +
            " where orderIsRefunded = 0 and orderIsDeleted = 0" +
            " and orderNumber = @orderNumber" +
            " and orderSecret = @orderSecret");
        if (orderResult.recordset && orderResult.recordset.length === 1) {
            const order = orderResult.recordset[0];
            return {
                found: true,
                orderID: order.orderID,
                paid: order.orderIsPaid
            };
        }
    }
    catch (error) {
        debugSQL(error);
    }
    return {
        found: false,
        paid: false
    };
};
export default _isOrderFoundAndPaid;
