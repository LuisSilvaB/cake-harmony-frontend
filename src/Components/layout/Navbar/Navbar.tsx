'use client'
import React from 'react'
import cx from '@/libs/cx';
import { Button } from '@/Components/ui';
import { gabarito } from '@/fonts';
import { HomeSidebar } from '@/app/home/components/ui';

const Navbar = () => {
  return (
    <nav className="flex h-14 w-full flex-col items-center justify-center bg-white">
      <div className="flex h-full w-full max-w-screen-xl items-center justify-between px-2 sm:px-6 lg:px-8">
        <section className="flex flex-1">
          <p
            className={cx(
              "text-xl font-extrabold text-atomic-tangerine-300",
              gabarito.className,
            )}
          >
            Cake
            <span className="pl-1 text-amber-900">Harmony</span>
          </p>
        </section>
        <section className="flex h-full items-center justify-between">
          <div className="flex h-full items-center justify-between">
            <ul className="hidden flex-row items-center gap-2 text-sm font-medium text-atomic-tangerine-900 transition-all duration-300 ease-in-out md:flex">
              <li className="cursor-pointer hover:text-atomic-tangerine-600">
                Inicio
              </li>
              <li className="cursor-pointer hover:text-atomic-tangerine-600">
                beneficios
              </li>
              <li className="cursor-pointer hover:text-atomic-tangerine-600">
                Nosotros
              </li>
              <li className="cursor-pointer hover:text-atomic-tangerine-600">
                Contacto
              </li>
              <li className="flex gap-2 pl-5">
                <Button
                  variant="default"
                  size="xs"
                  className="hover:text-whte border-atomic-tangerine-100 bg-atomic-tangerine-500 text-xs hover:bg-atomic-tangerine-600 hover:shadow-md"
                >
                  {" "}
                  Iniciar Sesión{" "}
                </Button>
                <Button
                  variant="outline"
                  size="xs"
                  className="border-atomic-tangerine-100 text-xs text-atomic-tangerine-500 hover:bg-atomic-tangerine-100 hover:text-atomic-tangerine-500"
                >
                  {" "}
                  Registrarse{" "}
                </Button>
              </li>
            </ul>
            <HomeSidebar className='flex md:hidden'/>
          </div>
        </section>
      </div>
    </nav>
  );
}

export default Navbar