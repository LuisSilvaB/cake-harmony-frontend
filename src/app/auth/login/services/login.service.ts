
import { createSupabaseBrowserClient } from "@/libs/supabase/browser-client";

const supabase  = createSupabaseBrowserClient()

export class LoginService {
  constructor() {}

  async googleAuthLogin() {
    try{
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${origin}/auth/verify` },
      });
    } catch (error) {
      console.error(error)
    }
  }

  async googleAuthLogout() {
    try {
      await supabase.auth.signOut();
      localStorage.clear(); 
    } catch (error) {
      console.error(error);
    }
  }

}