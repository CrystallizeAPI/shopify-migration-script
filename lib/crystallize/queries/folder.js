export default `
  query getFolder(
    $itemId: ID!
  ) {
    treeNode(itemId: $itemId) {
        children{
            itemId
        }
    }
  }
`
