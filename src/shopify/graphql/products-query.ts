import gql from 'graphql-tag'

export const productsQuery = gql`
  query GetProducts($first: Int!, $after: String) {
    products(first: $first, after: $after) {
      pageInfo {
        hasNextPage
      }
      edges {
        cursor
        node {
          id
          title
          handle
          productType
          description
          descriptionHtml
          vendor
          featuredImage {
            url
          }
          tags
          collections(first: 20) {
            edges {
              node {
                title
              }
            }
          }
          variants(first: 20) {
            edges {
              node {
                availableForSale
                title
                sku
                price
                inventoryQuantity
                selectedOptions {
                  name
                  value
                }
                image {
                  url
                }
              }
            }
          }
        }
      }
    }
  }
`
