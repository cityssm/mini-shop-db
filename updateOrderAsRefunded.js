import * as sqlPool from "@cityssm/mssql-multi-pool";
import { _isOrderFoundAndPaid } from "./isOrderFoundAndPaid.js";
import debug from "debug";
const debugSQL = debug("mini-shop-db:updateOrderAsRefunded");
export const _updateOrderAsRefunded = async (config, orderNumber, orderSecret, refundDetails) => {
    const order = await _isOrderFoundAndPaid(config, orderNumber, orderSecret);
    if (!order.found || !order.paid) {
        return false;
    }
    try {
        const pool = await sqlPool.connect(config.mssqlConfig);
        await pool.request()
            .input("refundID", refundDetails.refundID)
            .input("refundUser", refundDetails.refundUser)
            .input("refundReason", refundDetails.refundReason)
            .input("orderID", order.orderID)
            .query("update MiniShop.Orders" +
            " set refundID = @refundID," +
            " refundTime = getdate()," +
            " refundUser = @refundUser," +
            " refundReason = @refundReason" +
            " where orderID = @orderID");
        return true;
    }
    catch (error) {
        debugSQL(error);
    }
    return false;
};
