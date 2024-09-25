import { z } from 'zod'
const tagSchema = z.object({
  id: z.number(),
  name: z.string(),
  color: z.string(),
  created_at: z.string(),
  id_main_tag: z.number(),
})

export const TagSchema = tagSchema