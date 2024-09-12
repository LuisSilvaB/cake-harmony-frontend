"use client";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(3, {
    message: "Nombre es obligatorio y debe tener al menos 3 caracteres",
  }).max(50),
  description: z.string().min(3,{
    message: "Descripción es obligatoria y debe tener al menos 3 caracteres",
  }).max(50),
  STORE_ID: z.number(),
});

export const  SubsidiarySchema = formSchema;