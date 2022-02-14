import {
  JsonSpec,
  Bootstrapper,
  EVENT_NAMES,
} from '@crystallize/import-utilities'
require('dotenv').config()

export const bootstrap = async (spec: JsonSpec): Promise<void> => {
  return new Promise((resolve, reject) => {
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
      resolve()
    })
    bootstrapper.on(EVENT_NAMES.ERROR, (err) => {
      console.error(err)
    })
    bootstrapper.setSpec(spec)
    bootstrapper.start()
  })
}
