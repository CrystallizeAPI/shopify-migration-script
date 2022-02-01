import gql from 'graphql-tag'

export const ordersQuery = gql`
  query GetOrders($first: Int!, $after: String) {
    orders(first: $first, after: $after) {
      pageInfo {
        hasNextPage
      }
      edges {
        cursor
        node {
          totalPriceSet {
            presentmentMoney {
              amount
              currencyCode
            }
          }
          lineItems(first: 10) {
            edges {
              cursor
              node {
                id
                name
                currentQuantity
                sku
                product {
                  id
                }
                variant {
                  id
                }
                discountedTotalSet {
                  presentmentMoney {
                    amount
                    currencyCode
                  }
                }
                originalTotalSet {
                  presentmentMoney {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
          customer {
            id
            firstName
            lastName
            email
            phone
            defaultAddress {
              firstName
              lastName
              company
              address1
              address2
              city
              country
              phone
              province
              zip
            }
          }
        }
      }
    }
  }
`
