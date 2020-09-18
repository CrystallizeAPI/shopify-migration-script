export default `
  mutation createTopic(
    $tenantId: ID!
    $name: String!
    $children: [CreateChildTopicInput!]
    $language: String!
  ) {
    topic {
      create(
        language: $language
        input: {
          tenantId: $tenantId
          name: $name
          children: $children
        }
      ) {
        id
      }
    }
  }
`
