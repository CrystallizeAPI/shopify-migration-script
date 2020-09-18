export default `
mutation PublishFolder(
  $id: ID!
  $language: String!
) {
  folder {
    publish(
      id: $id
      language: $language
    ) {
      id
    }
  }
}
`
