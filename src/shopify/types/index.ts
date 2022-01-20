export interface ShopifyImage {
  url: string
}

export interface ShopifyCollection {
  title: string
}

export interface ShopifyVariant {
  availableForSale: boolean
  title: string
  sku: string
  price: string
  inventoryQuantity: number
  position: number
  selectedOptions: {
    name: string
    value: string
  }[]
  image?: ShopifyImage
}

export interface ShopifyProduct {
  id: string
  title: string
  handle: string
  productType: string
  vendor: string
  description?: string
  descriptionHtml?: string
  tags?: string[]
  collections?: {
    edges: {
      node: ShopifyCollection
    }[]
  }
  variants?: {
    edges: {
      node: ShopifyVariant
    }[]
  }
  featuredImage?: ShopifyImage
}

export interface ShopifyConnectionEdge {
  cursor: string
  node: any
}
