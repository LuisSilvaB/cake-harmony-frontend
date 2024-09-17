"use client"
import { z } from "zod"

export const ProductSchema = z.object({
  name: z.string().min(3),
  price: z.number().min(1),
  description: z.string().min(3, { message: "Descripción es requerida" }),
  imageUrl: z.array(z.string()).min(1, { message: "Imagen es requerida" }),
  storeId: z.number(),
})