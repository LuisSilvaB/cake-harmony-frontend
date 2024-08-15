import { createClient } from "@supabase/supabase-js"

export const supabase = createClient(
  process.env.APP_SUPABASE_URL!,
  process.env.APP_SUPABASE_ANON_API!,
)