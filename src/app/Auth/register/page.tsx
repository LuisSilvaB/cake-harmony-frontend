'use client';
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";
import { useForm, FormProvider } from 'react-hook-form';
import { RegisterSchema } from './schema/register.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import RegisterBody from './Components/Layout/RegisterBody';
import { Form } from '@/components/ui/form';
import { UserType } from '../user/types/user.type';

const Register = () => {
  const [token, setToken] = useState<any | null>(null);

  const formMethods = useForm<Omit<UserType, "id" | "created_at">>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      password: "",
      email: "",
      image_url: "",
    },
    mode:"all"
  })

  useEffect(() => {
    const tokenFromCookie = Cookies.get('user-auth-access-token');
    if (tokenFromCookie) {
      try {
        const decodedToken = jwtDecode<any>(tokenFromCookie);
        formMethods.setValue("name", decodedToken.user_metadata.name);
        formMethods.setValue("password", decodedToken.user_metadata.password);
        formMethods.setValue("email", decodedToken.email);
        formMethods.setValue("image_url", decodedToken.user_metadata.picture);
      } catch (error) {
        console.error('Invalid token:', error);
      }
    } else {
      console.warn('Token not found in cookies');
    }

    return () => {
      setToken(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <FormProvider {...formMethods}>
      <div className="flex h-full w-full flex-col">
        <RegisterBody />
      </div>
    </FormProvider>
  );
};

export default Register;