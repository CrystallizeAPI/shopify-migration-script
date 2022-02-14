import { bootstrap } from './bootstrap'
import { createOrderSpec } from './json-spec'
import { ShopifyClient } from './shopify'

export const migrateOrders = async () => {
  const client = new ShopifyClient()
  const spec = await createOrderSpec(client)
  await bootstrap(spec)
}

migrateOrders()
