import sqlPool from '@cityssm/mssql-multi-pool'
import debug from 'debug'

import type { MiniShopConfig } from '../types.js'

const debugSQL = debug('mini-shop-db:acknowledgeOrderItem')

/**
 * Acknowledges an order item.
 * @param config - MSSQL config
 * @param orderID - Order ID
 * @param itemIndex - Item Index
 * @param acknowledgeValues - Acknowledge user and time
 * @param acknowledgeValues.acknowledgedUser - Acknowledge user
 * @param acknowledgeValues.acknowledgedTime - Acknowledge time
 * @returns `true` if successful
 */
export default async function _acknowledgeOrderItem(
  config: MiniShopConfig,
  orderID: number | string,
  itemIndex: number | string,
  acknowledgeValues: {
    acknowledgedUser: string
    acknowledgedTime?: Date
  }
): Promise<boolean> {
  try {
    const pool = await sqlPool.connect(config.mssqlConfig)

    const result = await pool
      .request()
      .input('acknowledgedUser', acknowledgeValues.acknowledgedUser)
      .input(
        'acknowledgedTime',
        Object.hasOwn(acknowledgeValues, 'acknowledgedTime')
          ? acknowledgeValues.acknowledgedTime
          : new Date()
      )
      .input('orderID', orderID)
      .input('itemIndex', itemIndex)
      .query(
        `update MiniShop.OrderItems
          set acknowledgedUser = @acknowledgedUser,
          acknowledgedTime = @acknowledgedTime
          where orderID = @orderID
          and itemIndex = @itemIndex`
      )

    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    return result.rowsAffected[0] === 1
  } catch (error) {
    debugSQL(error)
  }

  return false
}
