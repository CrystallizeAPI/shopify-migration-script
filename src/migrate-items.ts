import { bootstrap } from './bootstrap'
import { createItemSpec } from './json-spec'
import { ShopifyClient } from './shopify'

export const migrateItems = async () => {
  const client = new ShopifyClient()
  const spec = await createItemSpec(client)
  await bootstrap(spec)
}

migrateItems()
