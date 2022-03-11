import { JsonSpec } from '@crystallize/import-utilities'
import { mapOrder } from '../crystallize'
import { ShopifyClient, ShopifyConnectionEdge, ordersQuery } from '../shopify'

export const createOrderSpec = async (
  client: ShopifyClient
): Promise<JsonSpec> => {
  let edges: ShopifyConnectionEdge[]
  try {
    edges = await client.queryWithPagination(ordersQuery, 10)
  } catch (err) {
    console.error('Error querying orders', err)
    return
  }

  return {
    orders: edges.map((edge) => mapOrder(edge.node)),
  }
}
