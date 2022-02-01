import { JSONCustomer } from '@crystallize/import-utilities'
import { ShopifyCustomer } from '../shopify'

export const mapCustomer = (customer: ShopifyCustomer): JSONCustomer => {
  const split = customer.id.split('/')
  return {
    identifier: split[split.length - 1],
    firstName: customer.firstName || '',
    lastName: customer.lastName || '',
    companyName: customer.defaultAddress?.company,
    email: customer.email,
    phone: customer.phone,
    addresses: customer.defaultAddress
      ? [
          {
            type: 'delivery',
            street: customer.defaultAddress.address1,
            street2: customer.defaultAddress.address2,
            city: customer.defaultAddress.city,
            country: customer.defaultAddress.country,
            postalCode: customer.defaultAddress.zip,
            state: customer.defaultAddress.province,
          },
        ]
      : [],
  }
}
