'use client'
import React, { createContext, useEffect, useState } from 'react'

import { User } from '@supabase/supabase-js';
import { LoginService } from '../app/auth/login/services/login.service';
import { UserService } from '@/app/auth/user/service/user.service';
import { createSupabaseBrowserClient } from '@/libs/supabase/browser-client';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

const { googleAuthLogin, googleAuthLogout } = new LoginService()

const supabase = createSupabaseBrowserClient() 

interface AuthContext {
  handleGoogleLogin: () => void;
  handleGoogleLogout: () => void;
  handleRegisterUser: () => void;
  handleVerifyUser?: () => void;
  user: User | null;
}

export const authContext = createContext<AuthContext>({
  handleGoogleLogin: () => {},
  handleGoogleLogout: () => {},
  handleRegisterUser: () => {},
  handleVerifyUser: () => null,
  user: null,
})

export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [ user, setUser ] = useState<User | null>(null); 
  const router = useRouter()

  const handleGoogleLogin = async () => {
    await googleAuthLogin();
  };

  const handleGoogleLogout = async () => {
    await googleAuthLogout();
  };

  // const handleVerifyUser = async() => {
  //   const { access_token, sub } = verifyUserOnCookies();
  //   if (access_token && sub) {
  //     setUser(sub);
  //   }
  // }

  const authStateChange = async() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") return setUser(session?.user ?? null);
      if (event === "SIGNED_OUT") {
        router.push("/"); 
        Cookies.remove("user-auth-access-token");
        Cookies.remove("permissions");
        setUser(null);
        return;
      };
    })
  }

  const handleRegisterUser = () => {
    
  }

  useEffect(() => {
    authStateChange();
    
  }, []);

  return (
    <authContext.Provider value={{ 
      handleGoogleLogin,
      handleGoogleLogout,
      handleRegisterUser,
      user,
    }}>
      {children}
    </authContext.Provider>
  )
  
}

export default AuthContextProvider




