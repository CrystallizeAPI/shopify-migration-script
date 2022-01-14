export default `
mutation createProduct(
  $tenantId: ID!
  $shapeIdentifier: String!
  $vatTypeId: ID!
  $name: String!
  $components: [ComponentInput!]
  $variants: [CreateProductVariantInput!]!
  $tree: TreeNodeInput
  $externalReference: String
  $topicIds:[ID!]

  $language: String!
) {
  product {
    create(
      input: {
        tenantId: $tenantId
        shapeIdentifier: $shapeIdentifier
        vatTypeId: $vatTypeId
        name: $name
        components: $components
        variants: $variants
        tree: $tree
        externalReference: $externalReference
        topicIds: $topicIds
      }
      language: $language
    ) {
      id
      variants{
        id
        sku
      }
    }
  }
}
`
