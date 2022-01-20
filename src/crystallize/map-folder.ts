import { JSONFolder } from '@crystallize/import-utilities'

export const mapFolder = (name: string): JSONFolder => ({
  name,
  shape: 'shopify-migrated-folder',
})
