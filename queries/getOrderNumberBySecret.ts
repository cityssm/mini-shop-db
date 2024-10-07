import sqlPool, { type IResult } from '@cityssm/mssql-multi-pool'
import debug from 'debug'

import type { MiniShopConfig } from '../types'

const debugSQL = debug('mini-shop-db:getOrderNumberBySecret')

/**
 * Retrieves an order number from a given order secret.
 * @param config - MSSQL config
 * @param orderSecret - Order secret
 * @returns The order number if avaialble.
 */
export default async function _getOrderNumberBySecret(
  config: MiniShopConfig,
  orderSecret: string
): Promise<string | undefined> {
  try {
    const pool = await sqlPool.connect(config.mssqlConfig)

    // Get the order record
    const orderResult = (await pool
      .request()
      .input('orderSecret', orderSecret)
      .query(
        `select orderNumber
          from MiniShop.Orders
          where orderIsRefunded = 0
          and orderIsDeleted = 0
          and orderSecret = @orderSecret`
      )) as IResult<{ orderNumber: string }>

    if (orderResult.recordset.length === 0) {
      return undefined
    }

    return orderResult.recordset[0].orderNumber
  } catch (error) {
    debugSQL(error)
  }

  return undefined
}
