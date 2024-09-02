"use client";
import { z } from "zod";

const formSchema = z.object({
  name: z
    .string()
    .min(3, {
      message: "El nombre debe tener al menos 3 caracteres",
    })
    .max(50, {
      message: "El nombre no puede superar los 50 caracteres",
    }),
  description: z
    .string()
    .min(3, {
      message: "La descripción debe tener al menos 3 caracteres",
    })
    .max(50, {
      message: "La descripción no puede superar los 50 caracteres",
    }),
});

export const StoreSchema = formSchema;