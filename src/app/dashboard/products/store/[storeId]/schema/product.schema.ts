import { z } from 'zod'
const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const productSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  image_url: z.array(z.string()).optional(),
  images_files: z
  .any()
  .refine((file) => file?.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
  .refine(
    (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
    "Only .jpg, .jpeg, .png and .webp formats are supported."
  ),  
  MAIN_TAG: z.array(
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
  VARIANTS: z
    .array(
      z.object({
        id: z.number().optional(),
        created_at: z.string().optional(),
        PRODUCT_ID: z.number().optional(),
        presentation: z.string().optional(),
        unid: z.string().optional(),
      }),
    )
    .optional(),
});

export const ProductSchema = productSchema
export type ProductSchemaType = z.infer<typeof productSchema>