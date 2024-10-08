import { z } from 'zod'
const productSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  image_url: z.array(z.string()),
  TAGS: z.array(
    z.object({
      id: z.number(),
      name: z.string().min(3, {
        message: "El nombre debe tener al menos 3 caracteres",
      }),
      color: z.string().min(3, {
        message: "El color debe tener al menos 3 caracteres",
      }),
      created_at: z.string().optional(),
      id_main_tag: z.number().optional(),
    }),
  ),
  PRODUCT_VARIANTS: z
    .array(
      z.object({
        id: z.number(),
        size: z.number(),
        price: z.number(),
      }),
    )
    .optional(),
});

export const ProductSchema = productSchema
export type ProductSchemaType = z.infer<typeof productSchema>