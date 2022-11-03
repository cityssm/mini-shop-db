import * as sqlPool from "@cityssm/mssql-multi-pool";

import type * as sql from "mssql";
import type { MiniShopConfig, ShippingForm, CartItem } from "./types";

import debug from "debug";
const debugSQL = debug("mini-shop-db:createOrder");

type CreateOrderReturn = {
  success: true;
  orderNumber: string;
  orderSecret: string;
  orderTime: Date;
} | {
  success: false;
};


const insertOrderItem = async (config: MiniShopConfig, pool: sql.ConnectionPool, orderID: number, cartIndex: number, cartItem: CartItem) => {

  const product = config.products[cartItem.productSKU];

  const unitPrice = (typeof (product.price) === "number" ? product.price : Number.parseFloat(cartItem.unitPrice));

  // Create the item record
  await pool.request()
    .input("orderID", orderID)
    .input("itemIndex", cartIndex)
    .input("productSKU", cartItem.productSKU)
    .input("unitPrice", unitPrice)
    .input("quantity", cartItem.quantity)
    .query("insert into MiniShop.OrderItems (" +
      "orderID, itemIndex, productSKU, unitPrice, quantity)" +
      " values (@orderID, @itemIndex, @productSKU, @unitPrice, @quantity)");

  // Create the item field records

  if (product.formFieldsToSave) {
    for (const formField of product.formFieldsToSave) {

      await pool.request()
        .input("orderID", orderID)
        .input("itemIndex", cartIndex)
        .input("formFieldName", formField.formFieldName)
        .input("fieldValue", cartItem[formField.formFieldName] || "")
        .query("insert into MiniShop.OrderItemFields (" +
          "orderID, itemIndex, formFieldName, fieldValue)" +
          " values (@orderID, @itemIndex, @formFieldName, @fieldValue)");
    }
  }
};


export const _createOrder = async (config: MiniShopConfig,
  shippingForm: ShippingForm): Promise<CreateOrderReturn> => {

  const orderNumberFunction = config.orderNumberFunction;
  const orderNumber = orderNumberFunction();

  try {

    const pool = await sqlPool.connect(config.mssqlConfig);

    // Create the Order record

    const orderResult = await pool.request()
      .input("orderNumber", orderNumber)
      .input("shippingName", shippingForm.fullName.trim())
      .input("shippingAddress1", shippingForm.address.trim())
      .input("shippingAddress2", (shippingForm.address2 || "").trim())
      .input("shippingCity", shippingForm.city.trim())
      .input("shippingProvince", shippingForm.province.trim())
      .input("shippingCountry", (shippingForm.country || "").trim())
      .input("shippingPostalCode", shippingForm.postalCode.trim())
      .input("shippingEmailAddress", shippingForm.emailAddress.trim())
      .input("shippingPhoneNumberDay", shippingForm.phoneNumberDay.trim())
      .input("shippingPhoneNumberEvening", shippingForm.phoneNumberEvening.trim())
      .input("redirectURL", (shippingForm.redirectURL || "").trim())
      .query("insert into MiniShop.Orders (" +
        " orderNumber," +
        " shippingName, shippingAddress1, shippingAddress2," +
        " shippingCity, shippingProvince, shippingCountry, shippingPostalCode," +
        " shippingEmailAddress, shippingPhoneNumberDay, shippingPhoneNumberEvening, redirectURL)" +

        " output inserted.orderID, inserted.orderSecret, inserted.orderTime" +

        " values (@orderNumber, @shippingName, @shippingAddress1, @shippingAddress2," +
        " @shippingCity, @shippingProvince, @shippingCountry, @shippingPostalCode," +
        " @shippingEmailAddress, @shippingPhoneNumberDay, @shippingPhoneNumberEvening, @redirectURL)");

    const orderID = orderResult.recordset[0].orderID as number;
    const orderSecret = orderResult.recordset[0].orderSecret as string;
    const orderTime = orderResult.recordset[0].orderTime as Date;

    // Loop through the cart items

    const feeTotals: {
      [feeName: string]: number;
    } = {};

    const allProducts = config.products;

    for (let cartIndex = 0; cartIndex < shippingForm.cartItems.length; cartIndex += 1) {

      // Maximum number of items allowed in the cart
      if (cartIndex > 255) {
        break;
      }

      const cartItem = shippingForm.cartItems[cartIndex];

      // Ignore invalid SKUs
      if (!Object.prototype.hasOwnProperty.call(allProducts, cartItem.productSKU)) {
        debugSQL("Invalid SKU: " + cartItem.productSKU);
        continue;
      }

      // Create the item record
      await insertOrderItem(config, pool, orderID, cartIndex, cartItem);

      // Calculate the fees (if any)
      const product = allProducts[cartItem.productSKU];

      if (product.fees) {
        for (const feeName of product.fees) {

          feeTotals[feeName] = (feeTotals[feeName] || 0) +
            config.fees[feeName].feeCalculation(product);
        }
      }
    }

    // Create the fee records (if any)
    for (const feeName of Object.keys(feeTotals)) {

      await pool.request()
        .input("orderID", orderID)
        .input("feeName", feeName)
        .input("feeTotal", feeTotals[feeName])
        .query("insert into MiniShop.OrderFees (" +
          "orderID, feeName, feeTotal)" +
          " values (@orderID, @feeName, @feeTotal)");
    }

    return {
      success: true,
      orderNumber,
      orderSecret,
      orderTime
    };

  } catch (error) {
    debugSQL(error);
    return {
      success: false
    };
  }
};


export default _createOrder;
