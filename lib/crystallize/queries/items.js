export default `
  query getItemByReference(
    $tenantId: ID
    $language: String!
    $externalReferences: [String!]
  ) {
    items(
        tenantId:$tenantId, language:$language, externalReferences:$externalReferences
    ){
        id
        ... on Product {
            variants {
              name
              sku
              price
              stock
              attributes {
                attribute
                value
              }
              externalReference
              isDefault
            }
          }
        }
    }
  }
`
