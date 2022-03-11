import gql from 'graphql-tag'

export const customersQuery = gql`
  query GetCustomers($first: Int!, $after: String) {
    customers(first: $first, after: $after) {
      pageInfo {
        hasNextPage
      }
      edges {
        cursor
        node {
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
`
