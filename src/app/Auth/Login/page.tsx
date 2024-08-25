'use client' 
import React from 'react'
import { FcGoogle } from "react-icons/fc";
import {
  gabarito
} from "@/fonts"
import cx from '@/libs/cx';
import { Button, Input, Label } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth.hook';
import Link from 'next/link';

const Login = () => {
  const { handleGoogleLogin } = useAuth();  
  return (
    <div className="flex w-full flex-1 flex-col justify-center border md:flex-row">
      <section className="flex flex-1 items-center justify-center border bg-white">
        <div className="flex h-3/4 w-2/4 flex-col justify-center gap-4">
          <h3
            className={cx(
              "text-center text-2xl font-bold text-atomic-tangerine-500",
              gabarito.className,
            )}
          >
            Iniciar Sesión
          </h3>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input type="email" id="email" placeholder="correo@ejemplo.com" />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="password">Contraseña</Label>
            <Input type="password" id="password" placeholder="******" />
          </div>

          <Button className="w-full gap-2 border bg-white text-black hover:bg-white hover:text-black hover:shadow-lg">
            Iniciar Sesión
          </Button>

          <Button
            onClick={handleGoogleLogin}
            className="mt-[10px] w-full gap-2 border bg-white text-black hover:bg-white hover:text-black hover:shadow-lg"
          >
            <FcGoogle className="text-2xl" />
            <p>Iniciar Sesión con Google</p>
          </Button>
          <p>No tienes cuenta? <Link href="/auth/register">Registrate</Link></p>
        </div>
      </section>
      <section className="hidden flex-1 border lg:flex"></section>
    </div>
  );
}

export default Login