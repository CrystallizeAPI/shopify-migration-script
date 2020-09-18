export default `
    mutation removeNode($itemId: ID!){
        tree{
            deleteNode(itemId: $itemId) 
        }
    }
`
