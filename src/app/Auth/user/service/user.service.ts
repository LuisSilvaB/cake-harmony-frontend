import { supabase } from '@/config/config';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

export class UserService {
  constructor() {}

  verifyUserOnCookies() {
    const UserAuthtoken = Cookies.get('user-auth-access-token');
    const UserId = Cookies.get('user-auth-id');

    if (!UserAuthtoken && UserId) return { access_token: null, sub: UserId };
    if (UserAuthtoken && !UserId) return { access_token: UserAuthtoken, sub: null };
    if (!UserAuthtoken && !UserId) return { access_token: null, sub: null };
    return { access_token: UserAuthtoken, sub: UserId };
  }

  async getUserById( id: string ) {
    try {
      const user = supabase.from("USER").select("*").eq("id", id).single(); 
      if (!user) return null;
      return user;
    } catch (error) {
      console.log(error);
    }
  }

}