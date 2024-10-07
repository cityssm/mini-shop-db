import { releaseAll as pool_releaseAll } from '@cityssm/mssql-multi-pool'
import exitHook from 'exit-hook'

import _acknowledgeOrderItem from './queries/acknowledgeOrderItem.js'
import _createOrder, { type CreateOrderReturn } from './queries/createOrder.js'
import _deleteOrder, { type DeleteDetails } from './queries/deleteOrder.js'
import _getOrder from './queries/getOrder.js'
import _getOrderItem from './queries/getOrderItem.js'
import _getOrderNumberBySecret from './queries/getOrderNumberBySecret.js'
import _getOrders, { type GetOrderFilters } from './queries/getOrders.js'
import _isOrderFoundAndPaid, {
  type IsOrderFoundAndPaidReturn
} from './queries/isOrderFoundAndPaid.js'
import _unacknowledgeOrderItem from './queries/unacknowledgeOrderItem.js'
import _updateOrderAsPaid from './queries/updateOrderAsPaid.js'
import _updateOrderAsRefunded, {
  type RefundDetails
} from './queries/updateOrderAsRefunded.js'
import type {
  MiniShopConfig,
  Order,
  OrderItem,
  ShippingForm,
  StoreValidatorReturn
} from './types.js'

export default class MiniShopDB {
  readonly #config: MiniShopConfig

  constructor(miniShopConfig: MiniShopConfig) {
    this.#config = miniShopConfig

    exitHook(() => {
      void pool_releaseAll()
    })
  }

  async acknowledgeOrderItem(
    orderID: number | string,
    itemIndex: number | string,
    acknowledgeValues: {
      acknowledgedUser: string
      acknowledgedTime?: Date
    }
  ): Promise<boolean> {
    return await _acknowledgeOrderItem(
      this.#config,
      orderID,
      itemIndex,
      acknowledgeValues
    )
  }

  async createOrder(
    shippingForm: Partial<ShippingForm>
  ): Promise<CreateOrderReturn> {
    return await _createOrder(this.#config, shippingForm)
  }

  async deleteOrder(
    orderID: number,
    deleteDetails: DeleteDetails
  ): Promise<boolean> {
    return await _deleteOrder(this.#config, orderID, deleteDetails)
  }

  async unacknowledgeOrderItem(
    orderID: number | string,
    itemIndex: number | string
  ): Promise<boolean> {
    return await _unacknowledgeOrderItem(this.#config, orderID, itemIndex)
  }

  async updateOrderAsPaid(validOrder: StoreValidatorReturn): Promise<boolean> {
    return await _updateOrderAsPaid(this.#config, validOrder)
  }

  async updateOrderAsRefunded(
    orderNumber: string,
    orderSecret: string,
    refundDetails: RefundDetails
  ): Promise<boolean> {
    return await _updateOrderAsRefunded(
      this.#config,
      orderNumber,
      orderSecret,
      refundDetails
    )
  }

  async getOrder(
    orderNumber: string,
    orderSecret: string,
    orderIsPaid: boolean,
    enforceExpiry = true
  ): Promise<Order | undefined> {
    return await _getOrder(
      this.#config,
      { orderNumber, orderSecret, orderIsPaid },
      enforceExpiry
    )
  }

  async getOrderItem(
    orderID: number | string,
    itemIndex: number | string
  ): Promise<OrderItem | undefined> {
    return await _getOrderItem(this.#config, orderID, itemIndex)
  }

  async getOrderNumberBySecret(
    orderSecret: string
  ): Promise<string | undefined> {
    return await _getOrderNumberBySecret(this.#config, orderSecret)
  }

  async getOrders(filters: Partial<GetOrderFilters>): Promise<types.Order[]> {
    return await _getOrders(this.#config, filters)
  }

  async isOrderFoundAndPaid(
    orderNumber: string,
    orderSecret: string
  ): Promise<IsOrderFoundAndPaidReturn> {
    return await _isOrderFoundAndPaid(this.#config, orderNumber, orderSecret)
  }
}

export type * as types from './types.js'
