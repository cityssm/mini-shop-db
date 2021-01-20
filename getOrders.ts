import * as sqlPool from "@cityssm/mssql-multi-pool";
import * as sql from "mssql";
import * as config from "./config";

import type { Order, OrderItem } from "./types";


export interface GetOrderFilters {
  productSKUs?: string[];
  orderIsPaid?: 0 | 1;
  orderIsRefunded?: 0 | 1;
};


interface RawOrder {
  orderID: number;
  orderNumber: string;
  orderTime: Date;

  shippingName: string;
  shippingAddress1: string;
  shippingAddress2?: string;
  shippingCity: string;
  shippingProvince: string;
  shippingCountry: string;
  shippingPostalCode: string;
  shippingEmailAddress: string;
  shippingPhoneNumberDay: string;
  shippingPhoneNumberEvening: string;

  paymentID?: string;
  paymentTime?: Date;
  orderIsPaid: boolean;

  refundID?: string;
  refundTime?: Date;
  refundUser?: string;
  refundReason?: string;
  orderIsRefunded: boolean;

  itemIndex: number;
  productSKU: string;
  unitPrice: number;
  quantity: number;
  itemTotal: number;

  acknowledgedTime?: Date;
  acknowledgedUser?: string;
  itemIsAcknowledged: boolean;

  formFieldName?: string;
  fieldValue?: string;
}


export const getOrders = async (filters: GetOrderFilters): Promise<Order[]> => {

  try {
    const pool: sql.ConnectionPool =
      await sqlPool.connect(config.getMSSQLConfig());

    let sql = "select o.orderID, o.orderNumber, o.orderTime," +
      " o.shippingName, o.shippingAddress1, o.shippingAddress2, o.shippingCity, o.shippingProvince, o.shippingCountry, o.shippingPostalCode," +
      " o.shippingEmailAddress, o.shippingPhoneNumberDay, o.shippingPhoneNumberEvening," +
      " o.paymentID, o.paymentTime, o.orderIsPaid," +
      " o.refundID, o.refundTime, o.refundReason, o.orderIsRefunded," +
      " i.itemIndex, i.productSKU, i.unitPrice, i.quantity, i.itemTotal," +
      " i.acknowledgedTime, i.acknowledgedUser, i.itemIsAcknowledged," +
      " f.formFieldName, f.fieldValue" +
      " from MiniShop.OrderItems i" +
      " left join MiniShop.Orders o on i.orderID = o.orderID" +
      " left join MiniShop.OrderItemFields f on i.orderID = f.orderID and i.itemIndex = f.itemIndex" +
      " where o.orderIsDeleted = 0";

    if (filters.hasOwnProperty("productSKUs")) {
      sql += " and i.productSKU in ('" + filters.productSKUs.join("','") + "')";
    }

    if (filters.hasOwnProperty("orderIsPaid")) {
      sql += " and o.orderIsPaid = " + filters.orderIsPaid.toString();
    }

    if (filters.hasOwnProperty("orderIsRefunded")) {
      sql += " and o.orderIsRefunded = " + filters.orderIsRefunded.toString();
    }

    sql += " order by o.orderID desc, i.itemIndex asc, f.formFieldName";

    const rawResult = await pool.request()
      .query(sql);

    if (!rawResult.recordset || rawResult.recordset.length === 0) {
      return [];
    }

    const rawOrders = rawResult.recordset as RawOrder[];

    const orders: Order[] = [];

    let order: Order = null;
    let item: OrderItem = null;

    for (const rawOrder of rawOrders) {

      /*
       * Order
       */

      if (order !== null && order.orderID !== rawOrder.orderID) {
        order.items.push(item);
        item = null;

        orders.push(order);
        order = null;
      }

      if (order === null) {
        order = {
          orderID: rawOrder.orderID,
          orderNumber: rawOrder.orderNumber,
          orderTime: rawOrder.orderTime,

          shippingName: rawOrder.shippingName,
          shippingAddress1: rawOrder.shippingAddress1,
          shippingAddress2: rawOrder.shippingAddress2,
          shippingCity: rawOrder.shippingCity,
          shippingProvince: rawOrder.shippingProvince,
          shippingCountry: rawOrder.shippingCountry,
          shippingPostalCode: rawOrder.shippingPostalCode,
          shippingPhoneNumberDay: rawOrder.shippingPhoneNumberDay,
          shippingPhoneNumberEvening: rawOrder.shippingPhoneNumberEvening,
          shippingEmailAddress: rawOrder.shippingEmailAddress,

          paymentID: rawOrder.paymentID,
          paymentTime: rawOrder.paymentTime,
          orderIsPaid: rawOrder.orderIsPaid,

          refundID: rawOrder.refundID,
          refundTime: rawOrder.refundTime,
          refundUser: rawOrder.refundUser,
          refundReason: rawOrder.refundReason,
          orderIsRefunded: rawOrder.orderIsRefunded,

          items: []
        };
      }

      /*
       * Item
       */

      if (item !== null && item.itemIndex !== rawOrder.itemIndex) {
        order.items.push(item);
        item = null;
      }

      if (item === null) {
        item = {
          itemIndex: rawOrder.itemIndex,
          productSKU: rawOrder.productSKU,
          unitPrice: rawOrder.unitPrice,
          quantity: rawOrder.quantity,
          itemTotal: rawOrder.itemTotal,
          fields: [],
          acknowledgedTime: rawOrder.acknowledgedTime,
          acknowledgedUser: rawOrder.acknowledgedUser,
          itemIsAcknowledged: rawOrder.itemIsAcknowledged
        };
      }

      /*
       * Item Field
       */

      if (rawOrder.formFieldName !== null) {
        item.fields.push({
          formFieldName: rawOrder.formFieldName,
          fieldValue: rawOrder.fieldValue
        });
      }
    }

    order.items.push(item);
    orders.push(order);

    return orders;

  } catch (e) {
    config.logger.error(e);
  }

  return [];
};
