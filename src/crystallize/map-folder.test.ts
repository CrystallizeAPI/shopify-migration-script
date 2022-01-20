import test from 'ava'
import { mapFolder } from './map-folder'

test('mapFolder() returns a JSONFolder based on a name', (t) => {
  const folder = mapFolder('Toys')
  t.deepEqual(folder, {
    name: 'Toys',
    shape: 'shopify-migrated-folder',
  })
})
