export interface ShopifyMoneyV2 {
  amount: string
  currencyCode: string
}

export interface ShopifyMoneyBag {
  presentmentMoney: ShopifyMoneyV2
}

export interface ShopifyLineItem {
  id: string
  name: string
  currentQuantity: number
  sku?: string
  product?: {
    id: string
  }
  variant?: {
    id: string
  }
  discountedTotalSet: ShopifyMoneyBag
  originalTotalSet: ShopifyMoneyBag
}

export interface ShopifyCustomer {
  id: string
  firstName: string
  lastName: string
  email?: string
  phone?: string
  defaultAddress: {
    firstName: string
    lastName: string
    company: string
    address1: string
    address2: string
    city: string
    country: string
    phone: string
    province: string
    zip: string
  }
}

export interface ShopifyOrder {
  totalPriceSet: ShopifyMoneyBag
  lineItems: {
    edges: {
      node: ShopifyLineItem
    }[]
  }
  customer: ShopifyCustomer
}
