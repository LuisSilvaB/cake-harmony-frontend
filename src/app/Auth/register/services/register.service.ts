import { supabase } from "@/config/config";
import { UserType } from "../../user/types/user.type";


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
  
  async registerUser(data: Omit<UserType, "id" | "created_at">) {
    try {
      const hashedPassword = await this.hashPassword(data);
      const { name, email } = data;
      
      const { data: user, error } = await supabase.from('USER').insert({
        name,
        email,
        password: hashedPassword,
      }).select();
      
      if (error) {
        throw new Error('Error creating user: ' + error.message);
      }
      
      return user;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  }
}
