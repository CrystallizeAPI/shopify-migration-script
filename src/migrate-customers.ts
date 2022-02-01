import {
  Bootstrapper,
  EVENT_NAMES,
  JsonSpec,
} from '@crystallize/import-utilities'
import { mapCustomer } from './crystallize/map-customer'
import { customersQuery, ShopifyClient, ShopifyConnectionEdge } from './shopify'
require('dotenv').config()

export const migrateCustomers = async () => {
  const client = new ShopifyClient()
  let edges: ShopifyConnectionEdge[]
  try {
    edges = await client.queryWithPagination(customersQuery, 10)
  } catch (err) {
    console.error('Error querying orders', err)
    return
  }
  const customers = edges.map((edge) => mapCustomer(edge.node))

  const spec: JsonSpec = {
    customers,
  }

  const bootstrapper = new Bootstrapper()
  bootstrapper.setAccessToken(
    process.env.CRYSTALLIZE_ACCESS_TOKEN_ID,
    process.env.CRYSTALLIZE_ACCESS_TOKEN_SECRET
  )
  bootstrapper.setTenantIdentifier(process.env.TENANT_IDENTIFIER)
  bootstrapper.on(EVENT_NAMES.STATUS_UPDATE, (status) => {
    console.log(status)
  })
  bootstrapper.on(EVENT_NAMES.DONE, (status) => {
    console.log(
      `Bootstrapped "${bootstrapper.tenantIdentifier}" in ${status.duration}`
    )
    process.exit(0)
  })
  bootstrapper.on(EVENT_NAMES.ERROR, (err) => {
    console.error(err)
  })
  bootstrapper.setSpec(spec)
  bootstrapper.start()
}

migrateCustomers()
