import { DocumentNode, FieldNode, OperationDefinitionNode } from 'graphql'
import { GraphQLClient } from 'graphql-request'
import { ShopifyConnectionEdge } from './types'

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
export class ShopifyClient {
  client: GraphQLClient

  constructor() {
    const {
      SHOPIFY_API_VERSION,
      SHOPIFY_STORE_NAME,
      SHOPIFY_ADMIN_API_ACCESS_TOKEN,
    } = process.env
    this.client = new GraphQLClient(
      `https://${SHOPIFY_STORE_NAME}.myshopify.com/admin/api/${SHOPIFY_API_VERSION}/graphql.json`,
      {
        headers: {
          'X-Shopify-Access-Token': SHOPIFY_ADMIN_API_ACCESS_TOKEN,
        },
      }
    )
  }

  /**
   * queryWithPagination recursively fetches all the pages for the root type
   * being queried and returns an array of all available edges.
   *
   * @param query graphql query
   * @param first page size
   * @param after offset cursor
   * @param edges existing edges
   * @returns array of all edges
   */
  async queryWithPagination(
    query: DocumentNode,
    first: number,
    after?: string,
    allEdges: ShopifyConnectionEdge[] = []
  ): Promise<ShopifyConnectionEdge[]> {
    const node = query.definitions[0] as OperationDefinitionNode
    const field = node?.selectionSet?.selections[0] as FieldNode
    const value = field?.name?.value

    if (!value) {
      throw new Error('invalid query for pagination')
    }

    const response = await this.client.request(query, {
      first,
      after,
    })

    const edges = response[value].edges
    allEdges = allEdges.concat(edges)

    if (response[value]?.pageInfo?.hasNextPage) {
      // To avoid rate limiting from the Shopify Admin API.
      // https://shopify.dev/api/usage/rate-limits
      await delay(5000)

      return this.queryWithPagination(
        query,
        first,
        // Array.at would be nicer, but not supported <= node 16.6.0
        edges[edges.length - 1]?.cursor,
        allEdges
      )
    }
    return allEdges
  }
}
