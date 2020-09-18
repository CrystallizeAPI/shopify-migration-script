export default `
mutation PublishProduct(
  $id: ID!
  $language: String!
) {
  product {
    publish(
      id: $id
      language: $language
    ) {
      id
    }
  }
}
`
