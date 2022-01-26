import {
  JSONItemTopic,
  JSONProduct,
  JSONProductVariant,
} from '@crystallize/import-utilities'
import { ShopifyProduct } from '../shopify'
import { mapProductVariant } from './map-product-variant'

export const mapProduct = (product: ShopifyProduct): JSONProduct => {
  const variants: JSONProductVariant[] = product.variants?.edges.length
    ? product.variants.edges.map((edge, i) =>
        mapProductVariant(product, edge.node, i)
      )
    : [
        {
          name: product.title,
          sku: product.handle,
          price: 0,
          stock: 0,
          isDefault: true,
        },
      ]

  const collectionTopics: JSONItemTopic[] = product.collections?.edges.length
    ? product.collections.edges.map(({ node }) => ({
        path: `/collections/${node.title.toLowerCase().replace(' ', '-')}`,
      }))
    : []

  const tagTopics: JSONItemTopic[] = product.tags?.length
    ? product.tags.map((str) => ({
        path: `/tags/${str.toLowerCase().replace(' ', '-')}`,
      }))
    : []

  return {
    externalReference: product.id,
    name: product.title,
    shape: 'shopify-migrated-product',
    vatType: process.env.CRYSTALLIZE_VAT_TYPE,
    variants,
    topics: [...collectionTopics, ...tagTopics],
    parentCataloguePath: `/${product.productType
      .toLowerCase()
      .replace(' ', '-')
      .replace('_', '')}`,
    components: {
      vendor: product.vendor,
      description: {
        html: product.descriptionHtml,
      },
      featuredImage:
        process.env.IMPORT_IMAGES === 'true' && product.featuredImage
          ? [
              {
                src: product.featuredImage.url,
              },
            ]
          : [],
    },
  }
}
