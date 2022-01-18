import {
  Bootstrapper,
  JsonSpec,
  EVENT_NAMES,
} from '@crystallize/import-utilities'
import { createItemSpec } from './migrate-items'
import { ShopifyClient } from './shopify'
require('dotenv').config()

const runImport = async () => {
  const client = new ShopifyClient()
  const itemSpec = await createItemSpec(client)

  const spec: JsonSpec = {
    shapes: [
      {
        identifier: 'shopify-migrated-folder',
        name: 'Shopify Migrated Folder',
        type: 'folder',
      },
      {
        identifier: 'shopify-migrated-product',
        name: 'Shopify Migrated Product',
        type: 'product',
        components: [
          {
            id: 'featuredImage',
            name: 'Featured Image',
            type: 'images',
          },
          {
            id: 'vendor',
            name: 'Vendor',
            type: 'singleLine',
          },
          {
            id: 'description',
            name: 'Description',
            type: 'richText',
          },
        ],
      },
    ],
    items: itemSpec.items,
    topicMaps: itemSpec.topicMaps,
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

runImport()
