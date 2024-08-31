'use client';
import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { RegisterSchema } from './schema/register.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import RegisterBody from './Components/Layout/RegisterBody';
import { UserType } from '../user/types/user.type';
import useSession from '@/libs/supabase/use-session';
import { useRouter } from 'next/navigation';

const Register = () => {
  const router = useRouter()
  const session = useSession()


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
    if (session?.user) {
      formMethods.setValue("name", session.user.user_metadata.name ?? "");
      formMethods.setValue("email", session.user.email ?? "");
      formMethods.setValue("image_url", session.user.user_metadata.picture ?? "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);


  return (
    <FormProvider {...formMethods}>
      <div className="flex h-full w-full flex-col">
        <RegisterBody />
      </div>
    </FormProvider>
  );
};

export default Register;