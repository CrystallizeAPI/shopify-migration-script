import { JsonSpec } from '@crystallize/import-utilities'
import { bootstrap } from './bootstrap'
import {
  createItemSpec,
  createCustomerSpec,
  createOrderSpec,
} from './json-spec'
import { ShopifyClient } from './shopify'

const migrate = async () => {
  const client = new ShopifyClient()

  console.log('Fetching existing items from Shopify')
  const items = await createItemSpec(client)
  console.log(
    `Found ${items.items.length} items to import (including folders based on product type)`
  )
  console.log('Fetching existing customers from Shopify')
  const customers = await createCustomerSpec(client)
  console.log(`Found ${customers.customers.length} customers to import`)
  console.log('Fetching existing orders from Shopify')
  const orders = await createOrderSpec(client)
  console.log(`Found ${orders.orders.length} orders to import`)

  const spec: JsonSpec = {
    ...items,
    ...customers,
    ...orders,
  }

  await bootstrap(spec)
  process.exit(0)
}

migrate()
