import React, { createContext, useContext, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '@/redux/store';

interface AuthContext {
  handleGoogleLogin: () => void;
  handleGoogleLogout: () => void;
  handleRegisterUser: () => void;
  registerUserRol: () => void;
}

export const authContext = createContext<AuthContext>({
  handleGoogleLogin: () => {},
  handleGoogleLogout: () => {},
  handleRegisterUser: () => {},
  registerUserRol: () => {},
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch<AppDispatch>()
}


