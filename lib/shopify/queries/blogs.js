export default `
  query GetBlogs($first: Int!, $after: String) {
    blogs(first: $first, after: $after) {
      pageInfo {
        hasNextPage
      }
      edges {
        cursor
        node {
          handle
          id
          handle
          title
          url
        }
      }
    }
  }
`;
