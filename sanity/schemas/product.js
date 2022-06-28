export default {
  name: 'product',
  title: 'Product',
  type: 'document',

  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
    },
    // {
    //   name: 'slug',
    //   title: 'Slug',
    //   type: 'slug',
    //   options: {
    //     source: 'name',
    //     maxLength: 100,
    //   },
    // },
    // {
    //   name: 'description',
    //   title: 'Description',
    //   type: 'string',
    // },
    {
      name: 'price',
      title: 'Price',
      type: 'number',
    },
    {
      name: 'models',
      title: 'Models',
      type: 'array',
      of: [
        {
          name: 'model',
          title: 'Model',
          type: 'object',
          fields: [
            {
              name: 'name',
              title: 'Name',
              type: 'string',
            },
            {
              name: 'price',
              title: 'Price',
              type: 'number',
            },
            {
              name: 'colors',
              title: 'Colors',
              type: 'array',
              of: [
                {
                  name: 'color',
                  title: 'Color',
                  type: 'object',
                  fields: [
                    {
                      name: 'name',
                      title: 'Name',
                      type: 'string',
                    },
                    {
                      name: 'color',
                      title: 'Color',
                      type: 'string',
                    },
                    {
                      name: 'price',
                      title: 'Price',
                      type: 'number',
                    },
                    {
                      name: 'images',
                      title: 'Images',
                      type: 'array',
                      of: [{ type: 'image' }],
                      options: {
                        hotspot: true,
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'storages',
      title: 'Storages',
      type: 'array',
      of: [
        {
          name: 'storage',
          title: 'Storage',
          type: 'object',
          fields: [
            {
              name: 'name',
              title: 'Name',
              type: 'string',
            },
            {
              name: 'inStock',
              title: 'InStock',
              type: 'boolean',
            },
            {
              name: 'price',
              title: 'Price',
              type: 'number',
            },
          ],
        },
      ],
    },
    {
      name: 'colors',
      title: 'Colors',
      type: 'array',
      of: [
        {
          name: 'color',
          title: 'Color',
          type: 'object',
          fields: [
            {
              name: 'name',
              title: 'Name',
              type: 'string',
            },
            {
              name: 'color',
              title: 'Color',
              type: 'string',
            },
            {
              name: 'price',
              title: 'Price',
              type: 'number',
            },
            {
              name: 'images',
              title: 'Images',
              type: 'array',
              of: [{ type: 'image' }],
              options: {
                hotspot: true,
              },
            },
          ],
        },
      ],
    },
  ],
}
