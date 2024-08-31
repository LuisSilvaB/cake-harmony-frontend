"use client";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(3, {
    message: "El nombre es requerido",
  }).max(50, {
    message: "El nombre no puede superar los 50 caracteres",
  }).trim(),
  description: z.string().min(3, {
    message: "La descripción es requerida",
  }).max(50, {
    message: "La descripción no puede superar los 50 caracteres", 
  }).trim(),
});

export const StoreSchema = formSchema;