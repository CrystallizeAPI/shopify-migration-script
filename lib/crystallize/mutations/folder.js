export default `
  mutation createFolder(
    $tenantId: ID!
    $shapeId: ID!
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
          shapeId: $shapeId
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
`;
