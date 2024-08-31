"use client"
import Icon from '@/components/ui/icon'
import useSession from '@/libs/supabase/use-session'
import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { DropdownMenu, DropdownMenuShortcut, DropdownMenuTrigger } from '@/components/ui/dropdown'
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown'
import { useAuth } from '@/hooks/useAuth.hook'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui'
import CreateStoreDialog from '@/app/dashboard/[storeId]/components/dialogs/createStoreDialog'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const Navbar = () => {
  const session = useSession()
  const { handleGoogleLogout } = useAuth() 
  
  return (
    <nav className="h-30 flex h-full max-h-14 w-full items-center justify-between bg-white p-4">
      <div className="flex items-center gap-2">
        <Select>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecciona una tienda" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sucursal 1">Tienda 1</SelectItem>
            <SelectItem value="sucursal 2">Tienda 2</SelectItem>
            <SelectItem value="sucursal 3">Tienda 3</SelectItem>
          </SelectContent>
        </Select>
        <CreateStoreDialog />
      </div>

      <div className="flex items-center gap-2">
        {session?.user?.user_metadata?.avatar_url ? (
          <img
            src={session?.user?.user_metadata?.avatar_url}
            alt="avatar"
            className="h-8 w-8 rounded-full"
          />
        ) : (
          <Skeleton className="h-8 w-8" />
        )}

        <div className="flex w-full flex-col justify-start gap-[2px]">
          {session?.user?.user_metadata?.full_name ? (
            <p className="text-start text-xs font-normal">
              {session?.user?.user_metadata?.full_name}{" "}
            </p>
          ) : (
            <Skeleton className="h-4 w-32" />
          )}
          {session?.user?.user_metadata?.email ? (
            <p className="text-xs font-normal text-gray-500">
              {session?.user?.user_metadata?.email}{" "}
            </p>
          ) : (
            <Skeleton className="h-3 w-40" />
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex w-fit cursor-pointer flex-row gap-2 outline-none">
            <Icon
              remixIconClass="ri-more-2-line"
              size="xl"
              color="atomic-900"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="-translate-x-4">
            <DropdownMenuLabel className="text-xs font-normal text-gray-500">
              Mi cuenta
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleGoogleLogout}
              className="text-xs font-normal text-gray-500"
            >
              Cerrar sesión
              <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}

export default Navbar