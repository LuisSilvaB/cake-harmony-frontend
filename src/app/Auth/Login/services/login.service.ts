import { supabase } from "@/config/config"
import { UserService } from "../../user/service/user.service";

export class LoginService {
  constructor() {}

  async googleAuthLogin() {
    try{
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: "http://localhost:3000/",
        },
      })
      if (error)
        throw new Error(
          "Ocurrio un error durante la autentificación de usuario",
        );
      return data
    } catch (error) {
      console.error(error)
    }
  }

  async googleAuthLogout() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error)
        throw new Error(
          "Ocurrio un error durante la desautentificación de usuario",
        );
    } catch (error) {
      console.error(error);
    }
  }

}