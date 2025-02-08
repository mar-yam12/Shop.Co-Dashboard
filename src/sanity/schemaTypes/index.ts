
import { type SchemaTypeDefinition } from 'sanity'
import { product, category, style } from './product'

import order from './order'
import customer from './customer'

import user from './user'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [product, category, style, order, customer, user],
}
