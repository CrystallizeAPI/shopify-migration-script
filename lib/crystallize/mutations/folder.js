export default `
  mutation createFolder(
    $tenantId: ID!
    $shapeIdentifier: String!
    $name: String!
    $tree: TreeNodeInput
    $components: [ComponentInput!]
    $externalReference: String
    $language: String!
  ) {
    folder {
      create(
        language: $language
        input: {
          tenantId: $tenantId
          shapeIdentifier: $shapeIdentifier
          components: $components
          name: $name
          tree: $tree
          externalReference: $externalReference
        }
      ) {
        id
      }
    }
  }
`
