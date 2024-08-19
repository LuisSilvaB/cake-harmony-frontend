'use client'
import React, { createContext, useEffect, useState } from 'react'
import { supabase } from '../config/config';
import { User } from '@supabase/supabase-js';
import { LoginService } from '../app/auth/login/services/login.service';
import { UserService } from '@/app/auth/user/service/user.service';
import { useRouter } from 'next/navigation'
import { UserType } from '@/app/auth/user/types/user.type';
import Cookies from 'js-cookie';

const { googleAuthLogin, googleAuthLogout } = new LoginService()
const { verifyUserOnLocalStorage, getUserById } = new UserService()

interface AuthContext {
  handleGoogleLogin: () => void;
  handleGoogleLogout: () => void;
  handleRegisterUser: () => void;
  handleVerifyUserOnLocalStorage?: () => void;
  user: UserType | null;
  userStorage: User | null;
}

export const authContext = createContext<AuthContext>({
  handleGoogleLogin: () => {},
  handleGoogleLogout: () => {},
  handleRegisterUser: () => {},
  handleVerifyUserOnLocalStorage: () => null,
  user: null,
  userStorage: null,
})

export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [ userStorage, setUserStorage ] = useState<User | null>(null);
  const [ user, setUser ] = useState<UserType | null>(null); 

  const handleGoogleLogin = async() => {
    await googleAuthLogin()
  }

  const handleGoogleLogout = async() =>  {
    await googleAuthLogout()
  }

  const handleVerifyUserOnLocalStorage = async() => {
    const data = verifyUserOnLocalStorage()
    if (!data) return;
    const user = await getUserById(data.user.id)
    if (!user?.data) {
      setUserStorage(data.user);
      setUser(null);
    }
    
  }

  const authStateChange = () => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        setUser(null);
        return
      }
      if (event === "SIGNED_IN") {
        Cookies.set('user-auth-access-token', session?.access_token ?? '', { expires: 3 });
      }
    });
  }

  const handleRegisterUser = () => {}

  useEffect(() => {
    authStateChange();
    handleVerifyUserOnLocalStorage();
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




