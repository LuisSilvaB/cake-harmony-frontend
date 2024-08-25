'use client'
import React, { createContext, useEffect, useState } from 'react'
import { supabase } from '../config/config';
import { User } from '@supabase/supabase-js';
import { LoginService } from '../app/auth/login/services/login.service';
import { UserService } from '@/app/auth/user/service/user.service';
import { useRouter } from 'next/navigation'
import { UserType } from '@/app/auth/user/types/user.type';
import Cookies from 'js-cookie';
import { Router } from 'next/router';

const { googleAuthLogin, googleAuthLogout } = new LoginService()
const { verifyUserOnCookies , getUserById } = new UserService()

interface AuthContext {
  handleGoogleLogin: () => void;
  handleGoogleLogout: () => void;
  handleRegisterUser: () => void;
  handleVerifyUser?: () => void;
  user: UserType | null;
  userStorage: User | null;
}

export const authContext = createContext<AuthContext>({
  handleGoogleLogin: () => {},
  handleGoogleLogout: () => {},
  handleRegisterUser: () => {},
  handleVerifyUser: () => null,
  user: null,
  userStorage: null,
})

export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [ userStorage, setUserStorage ] = useState<User | null>(null);
  const [ user, setUser ] = useState<UserType | null>(null); 
  const router = useRouter();

  const handleGoogleLogin = async() => {
    await googleAuthLogin()
  }

  const handleGoogleLogout = async() =>  {
    await googleAuthLogout()
  }

  const handleVerifyUser = async() => {
    const { sub } = verifyUserOnCookies()
    if (!sub) return;
    const user = await getUserById(sub)
    if (!user?.data) return router.push('/auth/login');
    Cookies.set("user-auth-id", user.data.id, { expires: 3 });
    setUser(user.data);
  }

  const authStateChange = async() => {
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN") {
        console.log('SIGNED_IN', session);
        console.log('session', session) 
        Cookies.set('user-auth-access-token', session?.access_token ?? '', { expires: 3 });
      }       
      else if (event === "INITIAL_SESSION"  && !session) {
        setUser(null);
        googleAuthLogout()
      }
      else if (event === "SIGNED_OUT") {
        setUser(null);
        return
      }
    });
  }

  const handleRegisterUser = () => {}

  useEffect(() => {
    authStateChange();
  }, []);

  return (
    <authContext.Provider value={{ 
      handleGoogleLogin,
      handleGoogleLogout,
      handleRegisterUser,
      user,
      userStorage,
    }}>
      {children}
    </authContext.Provider>
  )
  
}

export default AuthContextProvider




