import { JSONFolder } from '@crystallize/import-utilities'

export const mapFolder = (name: string): JSONFolder => ({
  name,
  cataloguePath: `/${name.toLowerCase().replace(' ', '-').replace('_', '')}`,
  shape: 'shopify-migrated-folder',
})
