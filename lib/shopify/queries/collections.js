export default `
  query GetCollections($first: Int!, $after: String) {
    collections(first: $first, after: $after) {
      pageInfo {
        hasNextPage
      }
      edges {
        cursor
        node {
          description
          descriptionHtml
          handle
          id
          image {
            altText
            id
            src
          }
          products(first: 250) {
            edges {
              node {
                id
              }
            }
          }
          title
          updatedAt
        }
      }
    }
  }
`;
