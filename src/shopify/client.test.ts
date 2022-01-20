import test from 'ava'
import sinon from 'sinon'
import { GraphQLClient } from 'graphql-request'
import { gql } from 'graphql-tag'
import { ShopifyClient } from './client'

test.beforeEach(() => {
  sinon
    .stub(GraphQLClient.prototype, 'request')
    .onFirstCall()
    .resolves({
      products: {
        pageInfo: {
          hasNextPage: true,
        },
        edges: [
          {
            cursor: 'ABC=',
          },
          { cursor: 'DEF=' },
        ],
      },
    })
    .onSecondCall()
    .resolves({
      products: {
        pageInfo: {
          hasNextPage: false,
        },
        edges: [
          {
            cursor: 'GHI=',
          },
          { cursor: 'JKL=' },
        ],
      },
    })
})

test('queryWithPagination() queries all pages', async (t) => {
  const query = gql`
    query ($first: Int!, $after: String) {
      products(first: $first, after: $after) {
        edges {
          cursor
          node {
            id
          }
        }
      }
    }
  `

  const client = new ShopifyClient()
  const edges = await client.queryWithPagination(query, 10)

  t.is(edges.length, 4, 'response has 4 edges')
  t.deepEqual(
    edges.map(({ cursor }) => cursor),
    ['ABC=', 'DEF=', 'GHI=', 'JKL='],
    'response has 4 unique edges'
  )
})
