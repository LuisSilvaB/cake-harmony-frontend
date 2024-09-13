"use client"
import Icon from '@/components/ui/icon'
import useSession from '@/libs/supabase/use-session'
import React, { FormEventHandler, useEffect, useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { DropdownMenu, DropdownMenuShortcut, DropdownMenuTrigger } from '@/components/ui/dropdown'
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown'
import { useAuth } from '@/hooks/useAuth.hook'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui'
import CreateStoreDialog from '@/app/dashboard/store/components/ui/dialogs/storeDialog'

import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/redux/store'
import { getStoresFeature, setSelectedStore } from '@/app/dashboard/store/feature/store.feature'
import { setSelectedSubsidiary } from '@/app/dashboard/subsidiary/feature/subsidiary.feature'
import { useRouter, useParams } from 'next/navigation'
import { StoreType } from '@/app/dashboard/store/types/store.type'
import { SelectGroup } from '@radix-ui/react-select'
import { Loader2Icon } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import SubsidiaryDialog from '@/app/dashboard/subsidiary/components/ui/dialogs/subsidiaryDialog'
import { getSubsidiaries } from '@/app/dashboard/subsidiary/feature/subsidiary.feature'
import { SubsidiaryType } from '@/app/dashboard/subsidiary/types/subsidiary.type'

const Navbar = () => {
  const { storeId, subsidiaryId } = useParams(); 
  const { handleGoogleLogout } = useAuth() 
  const session = useSession()
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const storesSelector = useSelector((state: RootState) => state.store);
  const storeLoadingSelector = useSelector((state: RootState) => state.store.loading);    
  const selectedStoreSelector = useSelector((state: RootState) => state.store.selectedStore);
  const subsidiariesSelector = useSelector((state: RootState) => state.subsidiary);
  const subsidiaryLoadingSelector = useSelector((state: RootState) => state.subsidiary.loading);
  const selectedSubsidiarySelector = useSelector((state: RootState) => state.subsidiary.selectedSubsidiary);

  const onChangeStore = async (e:any) => {
    const store = storesSelector.stores.find((store) => store.name === e)
    dispatch(setSelectedStore(store));
    dispatch(setSelectedSubsidiary(null));
    await dispatch(getSubsidiaries({ storeId: Number(store?.id ?? 0) }));
    // router.push(`/dashboard/pointOfSale/store/${store?.id}`);
  }

  const onChangeSubsidiary = (e:any) => {
    const subsidiary = subsidiariesSelector.subsidiaries.find((subsidiary) => subsidiary.name === e)
    dispatch(setSelectedSubsidiary(subsidiary));
    // router.push(`/dashboard/pointOfSale/store/${selectedStoreSelector?.id ?? Number(storeId) ?? 0}/subsidiary/${subsidiary?.id}`);
  }

  useEffect(() => {
    const fetchStores = async () => {
      if (session?.user?.id && !storesSelector.stores.length) {
        const data = await dispatch(getStoresFeature({
          userId: session?.user?.id
        }));

        if(Array.isArray(data.payload) && storeId){
          
          const store:StoreType = data.payload.find(store => store.id === Number(storeId));
          
          dispatch(setSelectedStore(store));
          
          const subsidiaries = await dispatch(getSubsidiaries({ storeId: Number(storeId) }));

          if(Array.isArray(subsidiaries.payload) && subsidiaries.payload.length){
            const subsidiary: SubsidiaryType = subsidiaries.payload.find(
              (subsidiary) => subsidiary.id === Number(subsidiaryId),
            );
            dispatch(setSelectedSubsidiary(subsidiary));
          }
        }
      }
    }

    fetchStores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, session?.user?.id, storeId]);

  return (
    <nav className="h-30 flex h-full max-h-14 w-full items-center justify-between bg-white p-4">
      <div className="flex items-center gap-2">
        <Select value={selectedStoreSelector?.name ? selectedStoreSelector?.name : "" } onValueChange={onChangeStore}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecciona una tienda" />
          </SelectTrigger>
          <SelectContent>
            {storeLoadingSelector ? (
              <Loader2Icon className="text-atomic-900 h-5 w-5 animate-spin" />
            ) : null}
            <SelectGroup>
              {Array.isArray(storesSelector.stores) &&
              storesSelector.stores.length ? (
                storesSelector.stores.map((store) => (
                  <SelectItem
                    key={store.id}
                    value={store?.name ?? ""}
                    onChange={(e) => {
                      console.log(e);
                    }}
                  >
                    {store.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="sucursal 1">
                  No se encontraron tiendas
                </SelectItem>
              )}
            </SelectGroup>
          </SelectContent>
        </Select>
        <CreateStoreDialog />
        <div className="flex items-center gap-2">
        <Select value={selectedSubsidiarySelector?.name ? selectedSubsidiarySelector?.name : "" } onValueChange={onChangeSubsidiary} disabled={subsidiaryLoadingSelector as boolean || subsidiariesSelector.subsidiaries.length === 0}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecciona una sucursal" />
          </SelectTrigger>
          <SelectContent>
            {subsidiaryLoadingSelector ? (
              <Loader2Icon className="text-atomic-900 h-5 w-5 animate-spin" />
            ) : null}
            <SelectGroup>
              {Array.isArray(subsidiariesSelector.subsidiaries) &&
              subsidiariesSelector.subsidiaries.length ? (
                subsidiariesSelector.subsidiaries.map((store) => (
                  <SelectItem
                    key={store.id}
                    value={store?.name ?? ""}
                    onChange={(e) => {
                      console.log(e);
                    }}
                  >
                    {store.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="sucursal 1" className='text-xs text-gray-500 font-normal'>
                  No se encontraron sucursales
                </SelectItem>
              )}
            </SelectGroup>
          </SelectContent>
        </Select>
        <SubsidiaryDialog />
      </div>

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