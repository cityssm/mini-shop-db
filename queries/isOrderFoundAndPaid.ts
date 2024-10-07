import sqlPool, { type IResult } from '@cityssm/mssql-multi-pool'
import debug from 'debug'

import type { MiniShopConfig } from '../types.js'

const debugSQL = debug('mini-shop-db:isOrderFoundAndPaid')

export type IsOrderFoundAndPaidReturn =
  | {
      found: true
      paid: boolean
      orderID: number
    }
  | {
      found: false
      paid: false
    }

/**
 * Retrieves the existence and status of a given order.
 * @param config - MSSQL config
 * @param orderNumber - Order number
 * @param orderSecret - Order secret
 * @returns the status of the order
 */
export default async function _isOrderFoundAndPaid(
  config: MiniShopConfig,
  orderNumber: string,
  orderSecret: string
): Promise<IsOrderFoundAndPaidReturn> {
  try {
    const pool = await sqlPool.connect(config.mssqlConfig)

    const orderResult = (await pool
      .request()
      .input('orderNumber', orderNumber)
      .input('orderSecret', orderSecret)
      .query(
        `select orderID, orderIsPaid from MiniShop.Orders
          where orderIsRefunded = 0
          and orderIsDeleted = 0
          and orderNumber = @orderNumber
          and orderSecret = @orderSecret`
      )) as IResult<{
      orderID: number
      orderIsPaid: boolean
    }>

    if (orderResult.recordset.length === 1) {
      const order = orderResult.recordset[0]

      return {
        found: true,
        orderID: order.orderID,
        paid: order.orderIsPaid
      }
    }
  } catch (error) {
    debugSQL(error)
  }

  return {
    found: false,
    paid: false
  }
}
