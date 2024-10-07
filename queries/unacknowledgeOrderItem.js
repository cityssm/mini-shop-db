import sqlPool from '@cityssm/mssql-multi-pool';
import debug from 'debug';
const debugSQL = debug('mini-shop-db:unacknowledgeOrderItem');
/**
 * Unacknowledges a given order item.
 * @param config - MSSQL config
 * @param orderID - Order ID
 * @param itemIndex - Item index
 * @returns `true` when successful
 */
export default async function _unacknowledgeOrderItem(config, orderID, itemIndex) {
    try {
        const pool = await sqlPool.connect(config.mssqlConfig);
        const result = await pool
            .request()
            .input('orderID', orderID)
            .input('itemIndex', itemIndex)
            .query(`update MiniShop.OrderItems
          set acknowledgedUser = null,
          acknowledgedTime = null
          where orderID = @orderID
          and itemIndex = @itemIndex`);
        return result.rowsAffected[0] === 1;
    }
    catch (error) {
        debugSQL(error);
    }
    return false;
}
