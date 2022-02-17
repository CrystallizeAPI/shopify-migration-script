import { MultiBar, Presets } from 'cli-progress'
import {
  JsonSpec,
  Bootstrapper,
  EVENT_NAMES,
} from '@crystallize/import-utilities'
require('dotenv').config()

export const bootstrap = async (spec: JsonSpec): Promise<void> => {
  console.log('Starting import to Crystallize')
  const bar = new MultiBar(
    {
      hideCursor: true,
      clearOnComplete: true,
      barIncompleteChar: ' ',
      format: '{bar} {percentage}% | {spec}... {message}',
    },
    Presets.shades_grey
  )
  let shapesBar, topicsBar, itemsBar, ordersBar, customersBar
  if (spec.shapes?.length) {
    shapesBar = bar.create(100, 0, {
      spec: 'Shapes',
      message: '',
    })
  }
  if (spec.topicMaps?.length) {
    topicsBar = bar.create(100, 0, {
      spec: 'Topic Maps',
      message: '',
    })
  }
  if (spec.items?.length) {
    itemsBar = bar.create(100, 0, {
      spec: 'Items',
      message: '',
    })
  }
  if (spec.orders?.length) {
    ordersBar = bar.create(100, 0, {
      spec: 'Orders',
      message: '',
    })
  }
  if (spec.customers?.length) {
    customersBar = bar.create(100, 0, {
      spec: 'Customers',
      message: '',
    })
  }

  return new Promise((resolve, reject) => {
    const bootstrapper = new Bootstrapper()
    bootstrapper.setAccessToken(
      process.env.CRYSTALLIZE_ACCESS_TOKEN_ID,
      process.env.CRYSTALLIZE_ACCESS_TOKEN_SECRET
    )
    bootstrapper.setTenantIdentifier(process.env.TENANT_IDENTIFIER)
    bootstrapper.on(EVENT_NAMES.ITEMS_UPDATE, (status) => {
      try {
        if (status?.progress) {
          itemsBar.update(Math.floor(status.progress * 100), { spec: 'Items' })
        } else if (status?.message) {
          itemsBar.update(itemsBar.value, {
            spec: 'Items',
            message: status.message,
          })
        }
      } catch (err) {}
    })
    bootstrapper.on(EVENT_NAMES.SHAPES_UPDATE, (status) => {
      try {
        if (status?.progress) {
          shapesBar.update(Math.floor(status.progress * 100), {
            spec: 'Shapes',
          })
        } else if (status?.message) {
          shapesBar.update(shapesBar.value, {
            spec: 'Shapes',
            message: status.message,
          })
        }
      } catch (err) {}
    })
    bootstrapper.on(EVENT_NAMES.TOPICS_UPDATE, (status) => {
      try {
        if (status?.progress) {
          topicsBar.update(Math.floor(status.progress * 100), {
            spec: 'Topic Maps',
          })
        } else if (status?.message) {
          topicsBar.update(topicsBar.value, {
            spec: 'Topic Maps',
            message: status.message,
          })
        }
      } catch (err) {}
    })
    bootstrapper.on(EVENT_NAMES.ORDERS_UPDATE, (status) => {
      try {
        if (status?.progress) {
          ordersBar.update(Math.floor(status.progress * 100), {
            spec: 'Orders',
          })
        } else if (status?.message) {
          ordersBar.update(ordersBar.value, {
            spec: 'Orders',
            message: status.message,
          })
        }
      } catch (err) {}
    })
    bootstrapper.on(EVENT_NAMES.CUSTOMERS_UPDATE, (status) => {
      try {
        if (status?.progress) {
          customersBar.update(Math.floor(status.progress * 100), {
            spec: 'Customers',
          })
        } else if (status?.message) {
          customersBar.update(customersBar.value, {
            spec: 'Customers',
            message: status.message,
          })
        }
      } catch (err) {}
    })
    bootstrapper.on(EVENT_NAMES.DONE, (status) => {
      bar.stop()
      console.log(
        `Bootstrapped "${bootstrapper.tenantIdentifier}" in ${status.duration}`
      )
      resolve()
    })
    bootstrapper.on(EVENT_NAMES.ERROR, (err) => {
      console.error('Error:', err?.error)
    })
    bootstrapper.setSpec(spec)
    bootstrapper.start()
  })
}
