import { getClient } from "./client";
import {
  ARTICLES_QUERY,
  BLOGS_QUERY,
  COLLECTIONS_QUERY,
  PAGES_QUERY,
  PRODUCTS_QUERY,
  SHOP_QUERY,
} from "./queries";

export { getClient } from "./client";

export function getCollections(first = 250, after = null, injections = {}) {
  const { client = getClient() } = injections;

  return client.request(COLLECTIONS_QUERY, { first, after });
}

export async function getProducts(first = 250, after = null, injections = {}) {
  const { client = getClient() } = injections;

  return client.request(PRODUCTS_QUERY, { first, after });
}
