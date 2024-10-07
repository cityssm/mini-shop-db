import * as sqlPool from '@cityssm/mssql-multi-pool';
import debug from 'debug';
const debugSQL = debug('mini-shop-db:acknowledgeOrderItem');
export default async function _acknowledgeOrderItem(config, orderID, itemIndex, acknowledgeValues) {
    try {
        const pool = await sqlPool.connect(config.mssqlConfig);
        const result = await pool
            .request()
            .input('acknowledgedUser', acknowledgeValues.acknowledgedUser)
            .input('acknowledgedTime', Object.hasOwn(acknowledgeValues, 'acknowledgedTime')
            ? acknowledgeValues.acknowledgedTime
            : new Date())
            .input('orderID', orderID)
            .input('itemIndex', itemIndex)
            .query(`update MiniShop.OrderItems
          set acknowledgedUser = @acknowledgedUser,
          acknowledgedTime = @acknowledgedTime
          where orderID = @orderID
          and itemIndex = @itemIndex`);
        return result.rowsAffected[0] === 1;
    }
    catch (error) {
        debugSQL(error);
    }
    return false;
}
