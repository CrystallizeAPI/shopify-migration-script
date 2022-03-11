import test from 'ava'
import { ShopifyProduct } from '../shopify'
import { mapProductVariant } from './map-product-variant'

const product: ShopifyProduct = {
  id: 'shopify-teddy-bear',
  title: 'Teddy Bear',
  handle: 'teddy-bear',
  productType: 'Toys',
  vendor: 'Hasbruh',
  descriptionHtml: '<h1>Teddy Bear!</h1>',
  featuredImage: {
    url: 'https://static.wikia.nocookie.net/meme/images/d/db/Rick-astley.png',
  },
  variants: {
    edges: [
      {
        node: {
          availableForSale: true,
          title: 'Blue Teddy Bear',
          sku: 'blue-teddy-bear',
          price: '50.00',
          inventoryQuantity: 20,
          position: 1,
          selectedOptions: [
            {
              name: 'Colour',
              value: 'Blue',
            },
          ],
          image: {
            url: 'https://static.wikia.nocookie.net/meme/images/d/db/Rick-astley.png',
          },
        },
      },
    ],
  },
}

test.before(() => {
  process.env.IMPORT_IMAGES = 'true'
})

test('mapProductVariant() returns a JSONProductVariant based on a ShopifyProduct', (t) => {
  const productVariant = mapProductVariant(
    product,
    product.variants.edges[0].node,
    0
  )
  t.deepEqual(productVariant, {
    name: 'Blue Teddy Bear',
    sku: 'blue-teddy-bear',
    attributes: {
      Colour: 'Blue',
    },
    images: [
      {
        src: 'https://static.wikia.nocookie.net/meme/images/d/db/Rick-astley.png',
      },
    ],
    isDefault: true,
    price: 50,
    stock: 20,
  })
})
