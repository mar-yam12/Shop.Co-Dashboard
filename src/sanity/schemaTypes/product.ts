
export const product = {
    name: 'product',
    title: 'Product',
    type: 'document',
    fields: [
      {
        name: 'title',
        title: 'Title',
        type: 'string',
        validation: (Rule: { required: () => any }) => Rule.required()
      },
      {
        name: 'createdAt',
        title: 'Created At',
        type: 'datetime',
        initialValue: () => new Date().toISOString(),
      },
      {
        name: 'slug',
        title: 'Slug',
        type: 'slug',
        options: {
          source: 'title',
          maxLength: 96,
        },
        validation: (Rule: { required: () => any }) => Rule.required()
      },
      {
        name: 'price',
        title: 'Price',
        type: 'number',
        validation: (Rule: { required: () => { (): any; new(): any; positive: { (): any; new(): any } } }) => Rule.required().positive()
      },
      {
        name: 'rating',
        title: 'Rating',
        type: 'number',
        validation: (Rule: { required: () => { (): any; new(): any; min: { (arg0: number): { (): any; new(): any; max: { (arg0: number): any; new(): any } }; new(): any } } }) => Rule.required().min(0).max(5)
      },
      {
        name: 'originalPrice',
        title: 'Original Price',
        type: 'number',
        validation: (Rule: { positive: () => any }) => Rule.positive()
      },
      {
        name: 'description',
        title: 'Description',
        type: 'text',
        validation: (Rule: { required: () => any }) => Rule.required()
      },
      {
        name: 'images',
        title: 'Images',
        type: 'array',
        of: [{ type: 'image' }],
        validation: (Rule: { required: () => { (): any; new(): any; min: { (arg0: number): any; new(): any } } }) => Rule.required().min(1)
      },
      {
        name: 'colors',
        title: 'Colors',
        type: 'array',
        of: [{ type: 'string' }]
      },
      {
        name: 'sizes',
        title: 'Sizes',
        type: 'array',
        of: [{ type: 'string' }]
      },
      {
        name: 'tags',
        title: 'Tags',
        type: 'array',
        of: [{ type: 'string' }]
      },
      {
        name: 'isNewArrival',
        title: 'Is New Arrival',
        type: 'boolean',
        initialValue: false
      },
      {
        name: 'isTopSelling',
        title: 'Is Top Selling',
        type: 'boolean',
        initialValue: false
      },
      {
        name: 'inventory',
        title: 'Inventory',
        type: 'number',
        validation: (Rule: { required: () => { (): any; new(): any; integer: { (): { (): any; new(): any; min: { (arg0: number): any; new(): any } }; new(): any } } }) => Rule.required().integer().min(0)
      },
      {
        name: 'productDetails',
        title: 'Product Details',
        type: 'array',
        of: [{ type: 'string' }],
        validation: (Rule: { required: () => any }) => Rule.required()
      },
      {
        name: 'faqs',
        title: 'FAQs',
        type: 'array',
        of: [{
          type: 'object',
          fields: [
            {
              name: 'question',
              title: 'Question',
              type: 'string',
              validation: (Rule: { required: () => any }) => Rule.required()
            },
            {
              name: 'answer',
              title: 'Answer',
              type: 'text',
              validation: (Rule: { required: () => any }) => Rule.required()
            }
          ]
        }]
      },
      {
        name: 'category',
        title: 'Category',
        type: 'reference',
        to: [{ type: 'category' }],
        validation: (Rule: { required: () => any }) => Rule.required()
      },
      {
        name: 'style',
        title: 'Style',
        type: 'reference',
        to: [{ type: 'style' }],
        validation: (Rule: { required: () => any }) => Rule.required()
      },
      // {
      //   name: 'reviews',
      //   title: 'Reviews',
      //   type: 'array',
      //   of: [{ type: 'reference', to: [{ type: 'review' }], options: { weak: true } }],
      // },
    ]
  }
  
  export const category = {
    name: 'category',
    title: 'Category',
    type: 'document',
    fields: [
      {
        name: 'name',
        title: 'Name',
        type: 'string',
        validation: (Rule: { required: () => any }) => Rule.required()
      },
      {
        name: 'slug',
        title: 'Slug',
        type: 'slug',
        options: {
          source: 'name',
          maxLength: 96,
        },
        validation: (Rule: { required: () => any }) => Rule.required()
      }
    ]
  }
  
  export const style = {
    name: 'style',
    title: 'Style',
    type: 'document',
    fields: [
      {
        name: 'name',
        title: 'Name',
        type: 'string',
        validation: (Rule: { required: () => any }) => Rule.required()
      },
      {
        name: 'slug',
        title: 'Slug',
        type: 'slug',
        options: {
          source: 'name',
          maxLength: 96,
        },
        validation: (Rule: { required: () => any }) => Rule.required()
      }
    ]
  }
