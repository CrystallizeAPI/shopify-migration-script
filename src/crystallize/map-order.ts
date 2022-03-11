import { JSONOrder } from '@crystallize/import-utilities'
import { ShopifyOrder } from '../shopify'
import { mapCustomer } from './map-customer'

export const mapOrder = (order: ShopifyOrder): JSONOrder => {
  return {
    customer: mapCustomer(order.customer),
    cart: order.lineItems.edges.map(({ node }) => ({
      name: node.name,
      quantity: node.currentQuantity,
      meta: {
        shopifySku: node.sku,
        shopifyProductId: node.product?.id,
        shopifyVariantId: node.variant?.id,
      },
      price: {
        currency: node.originalTotalSet.presentmentMoney.currencyCode,
        gross: parseFloat(node.originalTotalSet.presentmentMoney.amount),
        net: parseFloat(node.originalTotalSet.presentmentMoney.amount),
      },
      subTotal: {
        currency: node.discountedTotalSet.presentmentMoney.currencyCode,
        gross: parseFloat(node.discountedTotalSet.presentmentMoney.amount),
        net: parseFloat(node.discountedTotalSet.presentmentMoney.amount),
      },
    })),
  }
}
