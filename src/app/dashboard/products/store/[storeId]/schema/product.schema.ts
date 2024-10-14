import { z } from 'zod'
const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const productSchema = z.object({
  id: z.number(),
  name: z.string().min(3, {
    message: "El nombre debe tener al menos 3 caracteres",
  }),
  description: z.string().min(3, {
    message: "El nombre debe tener al menos 3 caracteres",
  }),
  image_url: z.array(z.string()).optional(),
  images_files: z.array(z.object(
    {
      
    }
  )).optional(),
    // .refine((file) => file?.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
    // .refine(
    //   (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
    //   "Only .jpg, .jpeg, .png and .webp formats are supported.",
    // )
  MAIN_TAG: z
    .array(
      z.object({
        id: z.number(),
        name: z.string().min(3, {
          message: "El nombre debe tener al menos 3 caracteres",
        }),
        color: z.string().min(3, {
          message: "El color debe tener al menos 3 caracteres",
        }),
        created_at: z.string().optional(),
        id_main_tag: z.number().optional().nullable(),
      }),
    )
    .min(1, { message: "Debe seleccionar al menos una categoría" }),
  TAGS: z
    .array(
      z.object({
        id: z.number(),
        name: z.string().min(3, {
          message: "El nombre debe tener al menos 3 caracteres",
        }),
        color: z.string().min(3, {
          message: "El color debe tener al menos 3 caracteres",
        }),
        created_at: z.string().optional(),
        id_main_tag: z.number().optional().nullable(),
      }),
    )
    .min(1, { message: "Debe seleccionar al menos una subcategoría" }),
  VARIANTS: z
    .array(
      z.object({
        id: z.number(),
        created_at: z.string().optional(),
        PRODUCT_ID: z.number().optional(),
        presentation: z.string().optional(),
        unid: z.number().optional(),
      }),
    )
    .min(1, { message: "Debe agregar al menos una variante" })
});

export const ProductSchema = productSchema
export type ProductSchemaType = z.infer<typeof productSchema>