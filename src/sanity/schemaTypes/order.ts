import { defineField, defineType } from "sanity";

export const order = defineType({
  name: "order",
  type: "document",
  title: "Order",
  fields: [
    // Reference to customer
    defineField({
      name: "customer",
      type: "reference",
      title: "Customer",
      to: [{ type: "customer" }], // Reference the customer schema
      validation: (Rule) => Rule.required(),
    }),

    // Array of products with quantity
    defineField({
      name: "products",
      type: "array",
      title: "Products",
      of: [
        defineField({
          name: "productItem",
          type: "object",
          fields: [
            defineField({
              name: "product",
              type: "reference",
              title: "Product",
              to: [{ type: "product" }], // Reference the product schema
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "quantity",
              type: "number",
              title: "Quantity",
              validation: (Rule) =>
                Rule.required().min(1).error("Quantity must be at least 1"),
            }),
          ],
        }),
      ],
      validation: (Rule) =>
        Rule.required()
          .min(1)
          .error("Order must include at least one product."),
    }),

    // Order status
    defineField({
      name: "orderStatus",
      type: "string",
      title: "Order Status",
      options: {
        list: [
          { title: "Pending", value: "pending" },
          { title: "Processing", value: "processing" },
          { title: "Shipped", value: "shipped" },
          { title: "Completed", value: "completed" },
          { title: "Cancelled", value: "cancelled" },
        ],
        layout: "dropdown",
      },
      initialValue: "pending", // Default value
    }),

    // Payment method
    defineField({
      name: "paymentMethod",
      type: "string",
      title: "Payment Method",
      options: {
        list: [
          { title: "Cash on Delivery (COD)", value: "cod" },
          { title: "Online", value: "online" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),

    // Delivery address (referenced from customer)
    defineField({
      name: "deliveryAddress",
      type: "string",
      title: "Delivery Address",
      description: "This will be taken from the customer's address.",
      validation: (Rule) => Rule.required(),
    }),

    // Order date
    defineField({
      name: "orderDate",
      type: "datetime",
      title: "Order Date",
      validation: (Rule) => Rule.required(),
      initialValue: () => new Date().toISOString(), // Automatically set current date
    }),
    defineField({
      name: "totalAmount",
      type: "number",
      title: "Total Amount",
      validation: (Rule) => Rule.required().min(0),
    }),
  ],
});
