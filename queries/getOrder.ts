import sqlPool, { type IResult } from '@cityssm/mssql-multi-pool'
import debug from 'debug'

import type { MiniShopConfig, Order, OrderItemField } from '../types.js'

const debugSQL = debug('mini-shop-db:getOrder')

const orderTimeExpiryDays = 90
const paymentTimeExpiryDays = 180

/**
 * Retrieves an order record.
 * @param config - MSSQL config
 * @param orderDetails - Order details
 * @param orderDetails.orderNumber - The order number
 * @param orderDetails.orderSecret - The order secret
 * @param orderDetails.orderIsPaid - Whether the order is paid
 * @param enforceExpiry - When `true`, older orders will be restricted
 * @returns An order record when available
 */
export default async function _getOrder(
  config: MiniShopConfig,
  orderDetails: {
    orderNumber: string
    orderSecret: string
    orderIsPaid: boolean
  },
  enforceExpiry = true
): Promise<Order | undefined> {
  try {
    const pool = await sqlPool.connect(config.mssqlConfig)

    // Get the order record
    const orderResult = (await pool
      .request()
      .input('orderNumber', orderDetails.orderNumber)
      .input('orderSecret', orderDetails.orderSecret)
      .input('orderIsPaid', orderDetails.orderIsPaid ? 1 : 0)
      .query(
        `select orderID, orderNumber, orderSecret, orderTime,
          shippingName, shippingAddress1, shippingAddress2,
          shippingCity, shippingProvince, shippingCountry, shippingPostalCode,
          shippingEmailAddress, shippingPhoneNumberDay, shippingPhoneNumberEvening,
          paymentID, paymentTime, redirectURL
          from MiniShop.Orders
          where orderIsRefunded = 0 and orderIsDeleted = 0
          ${
            enforceExpiry
              ? ` and (datediff(minute, orderTime, getdate()) < ${orderTimeExpiryDays} or datediff(minute, paymentTime, getdate()) < ${paymentTimeExpiryDays})`
              : ''
          }
          and orderNumber = @orderNumber
          and orderSecret = @orderSecret
          and orderIsPaid = @orderIsPaid`
      )) as IResult<Order>

    if (orderResult.recordset.length === 0) {
      return undefined
    }

    const order = orderResult.recordset[0]

    // Get order items
    const orderItemsResult = await pool
      .request()
      .input('orderID', order.orderID)
      .query(
        `select itemIndex, productSKU, unitPrice, quantity, itemTotal
          from MiniShop.OrderItems
          where orderID = @orderID`
      )

    order.items = orderItemsResult.recordset

    // Get order item fields
    const fieldsResult = (await pool
      .request()
      .input('orderID', order.orderID)
      .query(
        `select itemIndex, formFieldName, fieldValue
          from MiniShop.OrderItemFields
          where orderID = @orderID`
      )) as IResult<OrderItemField>

    if (fieldsResult.recordset.length > 0) {
      const fieldsMap = new Map<number, OrderItemField[]>()

      const fieldsList = fieldsResult.recordset

      for (const fieldData of fieldsList) {
        if (fieldData.itemIndex === undefined) {
          continue
        }

        if (fieldsMap.has(fieldData.itemIndex)) {
          fieldsMap.get(fieldData.itemIndex)?.push(fieldData)
        } else {
          fieldsMap.set(fieldData.itemIndex, [fieldData])
        }
      }

      for (const orderItem of order.items) {
        if (fieldsMap.has(orderItem.itemIndex)) {
          orderItem.fields = fieldsMap.get(orderItem.itemIndex)
        }
      }
    }

    // Get order fees
    const orderFeesResult = await pool
      .request()
      .input('orderID', order.orderID)
      .query(
        `select feeName, feeTotal
          from MiniShop.OrderFees
          where orderID = @orderID`
      )

    order.fees = orderFeesResult.recordset

    if (orderDetails.orderIsPaid) {
      const paymentDataResult = await pool
        .request()
        .input('orderID', order.orderID)
        .query(
          `select dataName, dataValue
            from MiniShop.PaymentData
            where orderID = @orderID`
        )

      order.paymentData = paymentDataResult.recordset
    }

    return order
  } catch (error) {
    debugSQL(error)
  }

  return undefined
}
