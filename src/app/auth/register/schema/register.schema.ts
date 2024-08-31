"use client"
 
import { z } from "zod"
 
const formSchema = z.object({
  name: z.string().min(1),
  password: z
    .string()
    .min(8, {
      message: "Contraseña debe tener al menos 8 caracteres",
    })
    .max(12, {
      message: "Contraseña debe tener menos de 12 caracteres",
    }),
  email: z.string().min(1),
  image_url: z.string().min(1),
});

export const RegisterSchema = formSchema;