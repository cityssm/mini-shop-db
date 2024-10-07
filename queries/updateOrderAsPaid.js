import sqlPool from '@cityssm/mssql-multi-pool';
import debug from 'debug';
import _isOrderFoundAndPaid from './isOrderFoundAndPaid.js';
const debugSQL = debug('mini-shop-db:updateOrderAsPaid');
/**
 * Updates an order with paid.
 * @param config - MSSQL config
 * @param validOrder - A valid order
 * @returns `true` when the order is marked as paid
 */
export default async function _updateOrderAsPaid(config, validOrder) {
    if (!validOrder.isValid) {
        return false;
    }
    // Check if the order can be marked as paid
    const order = await _isOrderFoundAndPaid(config, validOrder.orderNumber, validOrder.orderSecret);
    if (!order.found) {
        return false;
    }
    else if (order.paid) {
        return true;
    }
    try {
        const pool = await sqlPool.connect(config.mssqlConfig);
        await pool
            .request()
            .input('paymentID', validOrder.paymentID)
            .input('orderID', order.orderID)
            .query(`update MiniShop.Orders
          set paymentID = @paymentID,
          paymentTime = getdate()
          where orderID = @orderID`);
        if (validOrder.paymentData !== undefined) {
            for (const dataName of Object.keys(validOrder.paymentData)) {
                await pool
                    .request()
                    .input('orderID', order.orderID)
                    .input('dataName', dataName)
                    // eslint-disable-next-line security/detect-object-injection
                    .input('dataValue', validOrder.paymentData[dataName] ?? '')
                    .query(`insert into MiniShop.PaymentData (orderID, dataName, dataValue)
              values (@orderID, @dataName, @dataValue)`);
            }
        }
        return true;
    }
    catch (error) {
        debugSQL(error);
    }
    return false;
}
