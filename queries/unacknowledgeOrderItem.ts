import sqlPool from '@cityssm/mssql-multi-pool'
import debug from 'debug'

import type { MiniShopConfig } from '../types.js'

const debugSQL = debug('mini-shop-db:unacknowledgeOrderItem')

export default async function _unacknowledgeOrderItem(
  config: MiniShopConfig,
  orderID: number | string,
  itemIndex: number | string
): Promise<boolean> {
  try {
    const pool = await sqlPool.connect(config.mssqlConfig)

    const result = await pool
      .request()
      .input('orderID', orderID)
      .input('itemIndex', itemIndex)
      .query(
        `update MiniShop.OrderItems
          set acknowledgedUser = null,
          acknowledgedTime = null
          where orderID = @orderID
          and itemIndex = @itemIndex`
      )

    return result.rowsAffected[0] === 1
  } catch (error) {
    debugSQL(error)
  }

  return false
}
