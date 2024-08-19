import { supabase } from '@/config/config';

export class UserService {
  constructor() {}

  verifyUserOnLocalStorage() {
    const data = localStorage.getItem('sb-jmvxuavxrxfaxtdkmibn-auth-token');
    if (!data) return null;
    return JSON.parse(data);
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