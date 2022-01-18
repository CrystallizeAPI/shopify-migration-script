import { JSONFolder } from '@crystallize/import-utilities'

export const mapFolder = (name: string): JSONFolder => ({
  name: name.replace('/', ''),
  shape: 'shopify-migrated-folder',
})
