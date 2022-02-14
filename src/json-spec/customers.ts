import { JsonSpec } from '@crystallize/import-utilities'
import { mapCustomer } from '../crystallize/map-customer'
import {
  ShopifyClient,
  ShopifyConnectionEdge,
  customersQuery,
} from '../shopify'

export const createCustomerSpec = async (
  client: ShopifyClient
): Promise<JsonSpec> => {
  let edges: ShopifyConnectionEdge[]
  try {
    edges = await client.queryWithPagination(customersQuery, 10)
  } catch (err) {
    console.error('Error querying customers', err)
    return
  }

  return {
    customers: edges.map((edge) => mapCustomer(edge.node)),
  }
}
