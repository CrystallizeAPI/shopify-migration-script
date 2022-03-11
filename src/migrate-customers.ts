import { bootstrap } from './bootstrap'
import { createCustomerSpec } from './json-spec'
import { ShopifyClient } from './shopify'

export const migrateCustomers = async () => {
  console.log('Fetching existing customers from Shopify')
  const client = new ShopifyClient()
  const spec = await createCustomerSpec(client)
  console.log(`Found ${spec.customers.length} customers to import`)
  await bootstrap(spec)
  process.exit(0)
}

migrateCustomers()
