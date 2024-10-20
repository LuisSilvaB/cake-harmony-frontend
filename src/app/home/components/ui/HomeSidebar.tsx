import { Button } from "@/components/ui";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import React from 'react'
import { BsList } from "react-icons/bs";
import Link from "next/link";

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

const HomeSidebar = (props: Props) => {
  return (
    <div {...props}>
      <Sheet>
        <SheetTrigger>
          <BsList className="h-auto w-7 text-atomic-tangerine-600" />
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <ul className="text-md mt-4 flex flex-col items-start gap-2 font-medium text-atomic-tangerine-900 transition-all duration-300 ease-in-out md:flex">
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
              <li className="flex w-full items-start gap-2">
                <Link href={"/auth/login"} prefetch = {true} className="flex items-center">
                  <Button
                    variant="default"
                    size="xs"
                    className="hover:text-whte border-atomic-tangerine-100 bg-atomic-tangerine-500 text-xs hover:bg-atomic-tangerine-600 hover:shadow-md"
                  >
                    {" "}
                    Iniciar Sesión{" "}
                  </Button>
                </Link>
                <Link href={"/auth/register"}></Link>
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
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default HomeSidebar