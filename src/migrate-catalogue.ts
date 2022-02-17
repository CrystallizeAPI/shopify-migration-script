import { bootstrap } from './bootstrap'
import { createItemSpec } from './json-spec'
import { ShopifyClient } from './shopify'

export const migrateCatalogue = async () => {
  console.log('Fetching existing items from Shopify')
  const client = new ShopifyClient()
  const spec = await createItemSpec(client)
  console.log(
    `Found ${spec.items.length} items to import (including folders based on product type)`
  )
  await bootstrap(spec)
  process.exit(0)
}

migrateCatalogue()
