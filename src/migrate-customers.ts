import { bootstrap } from './bootstrap'
import { createCustomerSpec } from './json-spec'
import { ShopifyClient } from './shopify'

export const migrateCustomers = async () => {
  const client = new ShopifyClient()
  const spec = await createCustomerSpec(client)
  await bootstrap(spec)
}

migrateCustomers()
