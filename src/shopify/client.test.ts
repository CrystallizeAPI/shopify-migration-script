import test from 'ava'
import { gql } from 'graphql-request'

test('queryWithPagination() queries all pages', async () => {
  const query = gql`
    query ($first: Int!, after: String) {
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
})
