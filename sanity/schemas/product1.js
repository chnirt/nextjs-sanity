export default {
  name: 'product1',
  title: 'Product1',
  type: 'document',

  initialValue: () => ({}),

  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 100,
      },
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'price',
      title: 'Price',
      type: 'number',
    },
    {
      name: 'rating',
      title: 'Rating',
      type: 'number',
      options: {
        min: 1,
        max: 5,
        step: 1,
      },
    },
    {
      name: 'reviewCount',
      title: 'ReviewCount',
      type: 'number',
      options: {
        min: 1,
        max: 100,
        step: 1,
      },
    },
    {
      name: 'size',
      title: 'Size',
      type: 'string',
    },
    {
      name: 'color',
      title: 'Color',
      type: 'string',
      options: {
        list: [
          { title: 'White', value: 'white' },
          { title: 'Beige', value: 'beige' },
          { title: 'Blue', value: 'blue' },
          { title: 'Brown', value: 'brown' },
          { title: 'Green', value: 'green' },
          { title: 'Purple', value: 'purple' },
          { title: 'Black', value: 'black' },
        ],
      },
    },
    {
      title: 'Tags',
      name: 'tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
    },
  ],
}
