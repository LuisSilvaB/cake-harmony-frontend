import { UserType } from "../../user/types/user.type";
import { createSupabaseBrowserClient } from "@/libs/supabase/browser-client";


const supabase = createSupabaseBrowserClient()

export class RegisterService {
  constructor() {}

  async hashPassword(data: Omit<UserType, "id" | "created_at">): Promise<string> {
    try {
      const { password } = data;
      const response = await fetch('/auth/register/api/bycript', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to hash password');
      }
      
      const passwordData = await response.json();
      
      if (!passwordData.hashedPassword) {
        throw new Error('Hashed password is missing in the response');
      }

      return passwordData.hashedPassword;
    } catch (error) {
      console.error('Error hashing password:', error);
      throw error;
    }
  }
  
  async registerUser(data: Omit<UserType, "created_at">) {
    try {
      const hashedPassword = await this.hashPassword(data);
      const { name, email } = data;
      
      const { data: user, error } = await supabase.from('USER').insert({
        name,
        email,
        password: hashedPassword,
        ROL_ID: process.env.NEXT_PUBLIC_SUGAR_SOVEREIGN_USER_KEY,
      }).select();

      if(!user || error) throw new Error('User not created');

      return user;

    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  }
}
