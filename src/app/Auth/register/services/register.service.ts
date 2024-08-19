import { supabase } from "@/config/config";
import { UserType } from "../../user/types/user.type";

export class RegisterService {
  constructor() {}

  async registerUser(data: UserType) {
    try {
      const { data: user, error } = await supabase.from("USER").insert(data).select();
      if (error)
        throw new Error(
          "Ocurrio un error durante el registro de usuario",
        );
      return user;
    } catch (error) {
      console.error(error);
    }
  }
}