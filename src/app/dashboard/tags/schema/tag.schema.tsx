import { z } from 'zod'
const tagSchema = z.object({
  id: z.number(),
  name: z.string().min(3, {
    message: "El nombre debe tener al menos 3 caracteres",
  }),
  color: z.string().min(3, {
    message: "El color debe tener al menos 3 caracteres",
  }),
  created_at: z.string().optional(), 
  id_main_tag: z.number().optional(),
})

export const TagSchema = tagSchema