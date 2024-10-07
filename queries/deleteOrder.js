import sqlPool from '@cityssm/mssql-multi-pool';
import debug from 'debug';
const debugSQL = debug('mini-shop-db:deleteOrder');
/**
 * Deletes an order.
 * @param config - MSSQL config
 * @param orderID - Order ID
 * @param deleteDetails - Deleting user and reason
 * @returns `true` if successful
 */
export default async function _deleteOrder(config, orderID, deleteDetails) {
    try {
        const pool = await sqlPool.connect(config.mssqlConfig);
        const orderStatusResult = await pool
            .request()
            .input('orderID', orderID)
            .query(`select orderIsPaid, orderIsRefunded
          from MiniShop.Orders
          where orderID = @orderID
          and orderIsDeleted = 0
          and (orderIsPaid = 0 or orderIsRefunded = 1)`);
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        if (orderStatusResult.recordset.length === 0) {
            return false;
        }
        await pool
            .request()
            .input('deleteUser', deleteDetails.deleteUser)
            .input('deleteReason', deleteDetails.deleteReason)
            .input('orderID', orderID)
            .query(`update MiniShop.Orders
          set deleteTime = getdate(),
          deleteUser = @deleteUser,
          deleteReason = @deleteReason
          where orderID = @orderID`);
        return true;
    }
    catch (error) {
        debugSQL(error);
    }
    return false;
}
