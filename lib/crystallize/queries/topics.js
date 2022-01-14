export default `
  query getTopics(
    $tenantId: ID!
    $language: String!
  ) {
    topic{
      getRootTopics(tenantId: $tenantId, language: $language) {
        id
        name
      }
    }
  }
`
