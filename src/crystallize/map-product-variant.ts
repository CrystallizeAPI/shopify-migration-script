import { JSONProductVariant } from '@crystallize/import-utilities'
import { ShopifyProduct, ShopifyVariant } from '../shopify'

export const mapProductVariant = (
  product: ShopifyProduct,
  variant: ShopifyVariant,
  i: number
): JSONProductVariant => {
  let attributes = {}
  variant.selectedOptions.forEach((option) => {
    attributes[option.name] = option.value
  })

  return {
    name: variant.title || product.title,
    sku: variant.sku || `${product.handle}-${i}`,
    price: parseFloat(variant.price) || 0,
    stock: 0, // variant.inventoryQuantity needs to be retrieved from admin api,
    isDefault: i === 0,
    attributes,
    images:
      process.env.IMPORT_IMAGES && variant.image
        ? [
            {
              src: variant.image.url,
            },
          ]
        : [],
  }
}
