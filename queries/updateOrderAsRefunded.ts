import sqlPool from '@cityssm/mssql-multi-pool'
import debug from 'debug'

import type { MiniShopConfig } from '../types.js'

import _isOrderFoundAndPaid from './isOrderFoundAndPaid.js'

const debugSQL = debug('mini-shop-db:updateOrderAsRefunded')

export interface RefundDetails {
  refundID: string
  refundUser: string
  refundReason: string
}

export default async function _updateOrderAsRefunded(
  config: MiniShopConfig,
  orderNumber: string,
  orderSecret: string,
  refundDetails: RefundDetails
): Promise<boolean> {
  // Check if the order can be marked as paid
  const order = await _isOrderFoundAndPaid(config, orderNumber, orderSecret)

  if (!order.found || !order.paid) {
    return false
  }

  try {
    const pool = await sqlPool.connect(config.mssqlConfig)

    await pool
      .request()
      .input('refundID', refundDetails.refundID)
      .input('refundUser', refundDetails.refundUser)
      .input('refundReason', refundDetails.refundReason)
      .input('orderID', order.orderID)
      .query(
        `update MiniShop.Orders
          set refundID = @refundID,
          refundTime = getdate(),
          refundUser = @refundUser,
          refundReason = @refundReason
          where orderID = @orderID`
      )

    return true
  } catch (error) {
    debugSQL(error)
  }

  return false
}
