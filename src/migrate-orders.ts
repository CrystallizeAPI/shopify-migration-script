import { bootstrap } from './bootstrap'
import { createOrderSpec } from './json-spec'
import { ShopifyClient } from './shopify'

export const migrateOrders = async () => {
  console.log('Fetching existing orders from Shopify')
  const client = new ShopifyClient()
  const spec = await createOrderSpec(client)
  console.log(`Found ${spec.orders.length} orders to import`)
  await bootstrap(spec)
  process.exit(0)
}

migrateOrders()
