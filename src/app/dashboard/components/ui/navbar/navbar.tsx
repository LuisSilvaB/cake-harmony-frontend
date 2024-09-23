"use client"
import Icon from '@/components/ui/icon'
import useSession from '@/libs/supabase/use-session'
import React, { useEffect } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { DropdownMenu, DropdownMenuShortcut, DropdownMenuTrigger } from '@/components/ui/dropdown'
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown'
import { useAuth } from '@/hooks/useAuth.hook'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/redux/store'
import { getStoresFeature, setSelectedStore } from '@/app/dashboard/store/feature/store.feature'
import { setSelectedSubsidiary } from '@/app/dashboard/subsidiaries/store/[storeId]/feature/subsidiary.feature'
import { StoreType } from '@/app/dashboard/store/types/store.type'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { getSubsidiaries } from '@/app/dashboard/subsidiaries/store/[storeId]/feature/subsidiary.feature'
import { SubsidiaryType } from '@/app/dashboard/subsidiaries/store/[storeId]/types/subsidiary.type'
import StoreSubsidiaryDialog from '@/app/components/ui/dialogs/storeSubsidiaryDialog'

const Navbar = () => {
  const { handleGoogleLogout } = useAuth() 
  const session = useSession()
  const dispatch = useDispatch<AppDispatch>();
  const { selectedStore, stores, loading: loadingStores } = useSelector((state: RootState) => state.store);
  const selectedSubsidiary = useSelector((state: RootState) => state.subsidiary.selectedSubsidiary);

  useEffect(() => {
    const fetchStores = async () => {
      if (session?.user?.id && !stores.length) {
        const data = await dispatch(getStoresFeature({
          userId: session?.user?.id
        }));

        if(Array.isArray(data.payload) && selectedStore?.id){
          
          const store:StoreType = data.payload.find(store => store.id === Number(selectedStore?.id));
          
          dispatch(setSelectedStore(store));
          
          const subsidiaries = await dispatch(getSubsidiaries({ storeId: Number(selectedStore?.id) }));

          if(Array.isArray(subsidiaries.payload) && subsidiaries.payload.length){
            const subsidiary: SubsidiaryType = subsidiaries.payload.find(
              (subsidiary) => subsidiary.id === Number(selectedSubsidiary?.id),
            );
            dispatch(setSelectedSubsidiary(subsidiary));
          }
        }
      }
    }

    fetchStores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <nav className="h-30 flex h-full max-h-14 w-full items-center justify-between bg-white p-4">
      <div className="flex items-center gap-3">
        <Avatar >
          <AvatarImage src={"https://github.com/shadcn.png"} className="h-8 w-8 rounded-full" />
          <AvatarFallback >MC</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <p className="text-sm font-semibold">
            {selectedStore?.name ?? "Selecciona una tienda"}
          </p>
          <div className='flex flex-row items-center justify-start gap-1 h-3'> 
            <Icon remixIconClass="ri-git-merge-fill" className='mb-1' color="atomic-500" size="sm" />
            <span className="text-xs font-light">
              {selectedSubsidiary?.name ?? "Selecciona una sucursal"}
            </span>
          </div>
        </div>

        <StoreSubsidiaryDialog />

      </div>

      <div className="flex items-center gap-2">
        {session?.user?.user_metadata?.avatar_url ? (
          <Avatar>
            <AvatarImage
              src={session?.user?.user_metadata?.avatar_url}
              className="h-8 w-10 rounded-full"
            />
            <AvatarFallback>Log</AvatarFallback>
          </Avatar>
        ) : (
          <Skeleton className="h-8 w-10" />
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