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

  const items = await createItemSpec(client)
  const customers = await createCustomerSpec(client)
  const orders = await createOrderSpec(client)

  const spec: JsonSpec = {
    ...items,
    ...customers,
    ...orders,
  }

  await bootstrap(spec)
}

migrate()
