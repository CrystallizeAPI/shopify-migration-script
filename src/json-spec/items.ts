import {
  JsonSpec,
  JSONStructuredTopic,
  JSONTopic,
} from '@crystallize/import-utilities'
import {
  productsQuery,
  ShopifyClient,
  ShopifyConnectionEdge,
  ShopifyProduct,
} from '../shopify'
import { mapProduct, mapFolder } from '../crystallize'

export const createItemSpec = async (
  client: ShopifyClient
): Promise<JsonSpec> => {
  let edges: ShopifyConnectionEdge[]
  try {
    edges = await client.queryWithPagination(productsQuery, 10)
  } catch (err) {
    console.error('Error querying products', err)
    return
  }
  const products = edges.map((edge) => mapProduct(edge.node))

  const folderNames: string[] = [
    ...new Set(
      edges.map(({ node }: { node: ShopifyProduct }) => node.productType)
    ),
  ].filter((name) => !!name)
  const folders = folderNames.map((name) => mapFolder(name))

  const collectionTopics: JSONTopic[] = products.flatMap((product) =>
    product.topics
      .filter((topic) =>
        (topic as JSONStructuredTopic).path.startsWith('/collections/')
      )
      .map((topic): JSONTopic => {
        // Array.at would be nicer, but not supported <= node 16.6.0
        const split = (topic as JSONStructuredTopic).path.split('/')
        return {
          name: split[split.length - 1],
        }
      })
  )
  const tagTopics: JSONTopic[] = products.flatMap((product) =>
    product.topics
      .filter((topic) =>
        (topic as JSONStructuredTopic).path.startsWith('/tags/')
      )
      .map((topic): JSONTopic => {
        // Array.at would be nicer, but not supported <= node 16.6.0
        const split = (topic as JSONStructuredTopic).path.split('/')
        return {
          name: split[split.length - 1],
        }
      })
  )

  return {
    shapes: [
      {
        identifier: 'shopify-migrated-folder',
        name: 'Shopify Migrated Folder',
        type: 'folder',
      },
      {
        identifier: 'shopify-migrated-product',
        name: 'Shopify Migrated Product',
        type: 'product',
        components: [
          {
            id: 'featuredImage',
            name: 'Featured Image',
            type: 'images',
          },
          {
            id: 'vendor',
            name: 'Vendor',
            type: 'singleLine',
          },
          {
            id: 'description',
            name: 'Description',
            type: 'richText',
          },
        ],
      },
    ],
    topicMaps: [
      {
        name: 'Collections',
        path: '/collections',
        children: collectionTopics,
      },
      {
        name: 'Tags',
        path: '/tags',
        children: tagTopics,
      },
    ],
    items: [...folders, ...products],
  }
}
