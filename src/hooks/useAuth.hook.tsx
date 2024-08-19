'use client'
import { useContext } from "react";
import { authContext } from "../context/auth-context";
export const useAuth = () => {
  const contextParmas = useContext(authContext);
  return contextParmas;
};
