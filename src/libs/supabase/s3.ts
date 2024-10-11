import { createSupabaseBrowserClient } from "@/libs/supabase/browser-client"

const supabase = createSupabaseBrowserClient()

export const uploadFile = async (file: File, filePath:string) => {
  const { data, error } = await supabase.storage
    .from("CAKE_HARMONY")
    .upload(filePath, file);
  if (error) {
    throw error;
  }
  return data;
};

export const getFile = async (filePath: string) => {
  const { data, error } = await supabase.storage
    .from("CAKE_HARMONY")
    .download(filePath);
  if (error) {
    throw error;
  }
  return data;
};

export const deleteFile = async (filePath: string[]) => {
  const { data, error } = await supabase.storage
    .from("CAKE_HARMONY")
    .remove(filePath);
  if (error) {
    throw error;
  }
  return data;
};