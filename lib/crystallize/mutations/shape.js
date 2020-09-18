export default `
  mutation createShape(
    $tenantId: ID!
    $name: String!
    $type:ShapeType!
    $components : [ShapeComponentInput!]
  ) {
    shape {
      create(
        input: {
          tenantId: $tenantId
          name: $name
          type: $type
          components: $components
        }
      ) {
        id
      }
    }
  }
`
