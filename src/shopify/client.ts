import { DocumentNode, FieldNode, OperationDefinitionNode } from 'graphql'
import { GraphQLClient } from 'graphql-request'
import { ShopifyConnectionEdge } from './types'

export class ShopifyClient {
  client: GraphQLClient

  constructor() {
    const {
      SHOPIFY_API_VERSION,
      SHOPIFY_STOREFRONT_ACCESS_TOKEN,
      SHOPIFY_STORE_NAME,
    } = process.env
    this.client = new GraphQLClient(
      `https://${SHOPIFY_STORE_NAME}.myshopify.com/api/${SHOPIFY_API_VERSION}/graphql.json`,
      {
        headers: {
          'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_ACCESS_TOKEN,
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
    edges: ShopifyConnectionEdge[] = []
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

    edges = response[value].edges.concat(edges)

    if (response[value]?.pageInfo?.hasNextPage) {
      return this.queryWithPagination(
        query,
        first,
        response[value]?.edges?.at(-1).cursor,
        edges
      )
    }
    return edges
  }
}
