import { createSupabaseBrowserClient } from '@/libs/supabase/browser-client';
import Cookies from 'js-cookie';


const supabase = createSupabaseBrowserClient()

export class UserService {
  constructor() {}

  async setAuthCokkie(UserAuthtoken: string) {
      Cookies.set("user-auth-access-token", UserAuthtoken, { expires: 3 });
  }

  async getUserById( id: string ) {
    try {
      const user = await supabase.from("USER").select("*").eq("id", id).single(); 
      if (!user) return null;
      return user;
    } catch (error) {
      console.log(error);
    }
  }

}

export default UserService