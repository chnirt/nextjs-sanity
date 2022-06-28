export default {
  name: 'model',
  title: 'Model',
  type: 'document',

  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
    },
    {
      title: 'product',
      name: 'Product',
      type: 'reference',
      to: [{ type: 'product' }],
    },
  ],
}
