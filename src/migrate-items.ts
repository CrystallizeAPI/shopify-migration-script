import {
  JSONFolder,
  JSONItemTopic,
  JSONProduct,
  JSONProductVariant,
  JsonSpec,
  JSONStructuredTopic,
  JSONTopic,
} from '@crystallize/import-utilities'
import {
  productsQuery,
  ShopifyClient,
  ShopifyConnectionEdge,
  ShopifyProduct,
} from './shopify'
import { mapProduct, mapFolder } from './crystallize'

export const createItemSpec = async (
  client: ShopifyClient
): Promise<JsonSpec> => {
  let edges: ShopifyConnectionEdge[]
  try {
    edges = await client.queryWithPagination(productsQuery, 10)
  } catch (err) {
    console.log(productsQuery)
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
      .map(
        (topic): JSONTopic => ({
          name: (topic as JSONStructuredTopic).path.split('/').at(-1),
        })
      )
  )
  const tagTopics: JSONTopic[] = products.flatMap((product) =>
    product.topics
      .filter((topic) =>
        (topic as JSONStructuredTopic).path.startsWith('/tags/')
      )
      .map(
        (topic): JSONTopic => ({
          name: (topic as JSONStructuredTopic).path.split('/').at(-1),
        })
      )
  )

  return {
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
