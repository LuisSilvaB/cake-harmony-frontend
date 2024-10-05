import { z } from 'zod'
const productSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  image_url: z.array(z.string()),
  PRODUCTS_TAG: z.array(z.object({
    type: z.string(),
    TAG: z.object({
      id: z.number(),
      name: z.string(),
      color: z.string(),
    }),
  })),
  PRODUCT_VARIANTS: z.array(z.object({
    id: z.number(),
    size: z.number(),
    price: z.number(),
  })).optional(),
})

export const ProductSchema = productSchema
export type ProductSchemaType = z.infer<typeof productSchema>