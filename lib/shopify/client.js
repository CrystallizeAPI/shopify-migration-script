import { GraphQLClient } from 'graphql-request'
import {
  SHOPIFY_API_VERSION,
  SHOPIFY__STOREFRON_API_KEY,
  SHOPIFY_STORE_NAME,
} from '../config'
/**
 * Create a Shopify Storefront GraphQL client for the provided name and token.
 */

let client

export function clientSingleton() {
  let url
  if (!client) {
    if (SHOPIFY_STORE_NAME.includes(`.`)) {
      url = `https://${SHOPIFY_STORE_NAME}/api/${SHOPIFY_API_VERSION}/graphql.json`
    } else {
      url = `https://${SHOPIFY_STORE_NAME}.myshopify.com/api/${SHOPIFY_API_VERSION}/graphql.json`
    }
    client = new GraphQLClient(url, {
      headers: {
        'X-Shopify-Storefront-Access-Token': SHOPIFY__STOREFRON_API_KEY,
      },
    })
  }
  return client
}

// export function getClient(injections = {}) {
//   const { createShopifyClient = createClient } = injections;
//   if (!client) {
//     client = createShopifyClient();
//   }
//   return client;
// }

export function getClient(injections = {}) {
  const { apiClient = clientSingleton } = injections

  return apiClient()
}
