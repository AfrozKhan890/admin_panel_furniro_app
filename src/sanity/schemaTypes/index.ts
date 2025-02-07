import { type SchemaTypeDefinition } from 'sanity'
import {product} from './product'
// import {payment} from './payment'

// import {shipment} from './shipment'
import { customer } from './customer'
import { order } from './order'
// import payment from './payment'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [product,customer,order],
}
