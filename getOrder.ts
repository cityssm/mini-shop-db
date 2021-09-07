import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as sql from "mssql";
import * as config from "./config.js";

import type { Order, OrderItemField } from "./types";

import { debug } from "debug";
const debugSQL = debug("mini-shop-db:getOrder");


export const getOrder = async (orderNumber: string, orderSecret: string, orderIsPaid: boolean, enforceExpiry: boolean = true) => {

  try {
    const pool: sql.ConnectionPool =
      await sqlPool.connect(config.getMSSQLConfig());

    // Get the order record

    const orderResult = await pool.request()
      .input("orderNumber", sql.VarChar(50), orderNumber)
      .input("orderSecret", sql.UniqueIdentifier, orderSecret)
      .input("orderIsPaid", sql.Bit, orderIsPaid ? 1 : 0)
      .query("select orderID, orderNumber, orderSecret, orderTime," +
        " shippingName, shippingAddress1, shippingAddress2," +
        " shippingCity, shippingProvince, shippingCountry, shippingPostalCode," +
        " shippingEmailAddress, shippingPhoneNumberDay, shippingPhoneNumberEvening," +
        " paymentID, paymentTime, redirectURL" +
        " from MiniShop.Orders" +
        " where orderIsRefunded = 0 and orderIsDeleted = 0" +
        (enforceExpiry
          ? " and (datediff(minute, orderTime, getdate()) < 90 or datediff(minute, paymentTime, getdate()) < 180)"
          : "") +
        " and orderNumber = @orderNumber" +
        " and orderSecret = @orderSecret" +
        " and orderIsPaid = @orderIsPaid");

    if (!orderResult.recordset || orderResult.recordset.length === 0) {
      return false;
    }

    const order = orderResult.recordset[0] as Order;

    // Get order items

    const orderItemsResult = await pool.request()
      .input("orderID", sql.BigInt, order.orderID)
      .query("select itemIndex, productSKU, unitPrice, quantity, itemTotal" +
        " from MiniShop.OrderItems" +
        " where orderID = @orderID");

    order.items = orderItemsResult.recordset;

    // Get order item fields

    const fieldsResult = await pool.request()
      .input("orderID", sql.BigInt, order.orderID)
      .query("select itemIndex, formFieldName, fieldValue" +
        " from MiniShop.OrderItemFields" +
        " where orderID = @orderID");

    if (fieldsResult.recordset && fieldsResult.recordset.length > 0) {

      const fieldsMap = new Map<number, OrderItemField[]>();

      const fieldsList: sql.IRecordSet<OrderItemField> = fieldsResult.recordset;

      for (const fieldData of fieldsList) {

        if (fieldsMap.has(fieldData.itemIndex)) {
          fieldsMap.get(fieldData.itemIndex).push(fieldData);
        } else {
          fieldsMap.set(fieldData.itemIndex, [fieldData]);
        }
      }

      for (const orderItem of order.items) {
        if (fieldsMap.has(orderItem.itemIndex)) {
          orderItem.fields = fieldsMap.get(orderItem.itemIndex);
        }
      }
    }

    // Get order fees

    const orderFeesResult = await pool.request()
      .input("orderID", sql.BigInt, order.orderID)
      .query("select feeName, feeTotal" +
        " from MiniShop.OrderFees" +
        " where orderID = @orderID");

    order.fees = orderFeesResult.recordset;

    if (orderIsPaid) {

      const paymentDataResult = await pool.request()
        .input("orderID", sql.BigInt, order.orderID)
        .query("select dataName, dataValue" +
          " from MiniShop.PaymentData" +
          " where orderID = @orderID");

      order.paymentData = paymentDataResult.recordset;
    }

    return order;

  } catch (e) {
    debugSQL(e);
  }

  return false;
};
