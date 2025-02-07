import { defineType, defineField } from 'sanity';

export const product = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'Name of the product',
      validation: (Rule) => Rule.required().min(3).max(50),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Detailed description of the product',
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'number',
      description: 'Price of the product in USD',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      description: 'Tags related to the product',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'sizes',
      title: 'Sizes',
      type: 'array',
      description: 'Available sizes for the product',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      description: 'Main image of the product',
      options: {
        hotspot: true, // Enable hotspot for better cropping
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          description: 'Alternative text for the image',
        }),
      ],
    }),
    defineField({
      name: 'rating',
      title: 'Rating',
      type: 'number',
      description: 'Average customer rating for the product',
      validation: (Rule) => Rule.min(0).max(5),
    }),
    defineField({
      name: 'discountPercentage',
      title: 'Discount Percentage',
      type: 'number',
      description: 'Discount percentage on the product',
      validation: (Rule) => Rule.min(0).max(100),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      description: 'Category of the product (e.g., chair, table)',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'isFeaturedProduct',
      title: 'Is Featured Product',
      type: 'boolean',
      description: 'Indicates if the product is a featured product',
      initialValue: false,
    }),
    defineField({
      name: 'stockLevel',
      title: 'Stock Level',
      type: 'number',
      description: 'Number of items available in stock',
      validation: (Rule) => Rule.min(0),
    }),
  ],

  preview: {
    select: {
      title: 'name', // Name as the primary title
      media: 'image', // Use the product's image
      productId: '_id', // Product reference ID
      price: 'price', // Price field
    },
    prepare(selection) {
      const { title, media, productId, price } = selection;
      return {
        title: title,
        subtitle: `Product ID: ${productId} | Price: ${price}`, // Combine productId and price in the subtitle
        media, // Display the product image as the thumbnail
      };
    },
  },
});
