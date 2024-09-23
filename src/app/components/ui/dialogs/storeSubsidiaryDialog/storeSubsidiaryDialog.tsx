"use client"
import React from 'react'
import { AppDispatch, RootState } from '@/redux/store'
import { useDispatch, useSelector } from 'react-redux'
import useToggle from '@/hooks/useToggle.hook'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle, 
  DialogDescription, 
} from "@/components/ui/dialog";
import {
  Button,
  Label,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import Icon from "@/components/ui/icon";
import { setSelectedStore } from '@/app/dashboard/store/feature/store.feature'
import { getSubsidiaries, setSelectedSubsidiary } from '@/app/dashboard/subsidiaries/store/[storeId]/feature/subsidiary.feature'
import { Loader2Icon } from 'lucide-react'
import CreateStoreDialog from '@/app/dashboard/store/components/ui/dialogs/storeDialog';
import SubsidiaryDialog from '@/app/dashboard/subsidiaries/store/[storeId]/components/ui/dialogs/subsidiaryDialog';

const StoreSubsidiaryDialog = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { selectedStore, stores, loading: storeLoading } = useSelector((state: RootState) => state.store)
  const { selectedSubsidiary, subsidiaries, loading: subsidiaryLoading } = useSelector((state: RootState) => state.subsidiary)

  const toggle = useToggle(!selectedStore && !selectedSubsidiary)
  
  const onChangeStore = async (e:any) => {
    const store = stores.find((store) => store.name === e)
    dispatch(setSelectedStore(store));
    dispatch(setSelectedSubsidiary(null));
    localStorage.setItem("selectedStore", JSON.stringify(store));
    localStorage.setItem("stores", JSON.stringify(stores));
    await dispatch(getSubsidiaries({ storeId: Number(store?.id ?? 0) }));
  }

  const onChangeSubsidiary = (e:any) => {
    const subsidiary = subsidiaries.find((subsidiary) => subsidiary.name === e)
    localStorage.setItem("selectedSubsidiary", JSON.stringify(subsidiary));
    dispatch(setSelectedSubsidiary(subsidiary));
  }

  return (
    <Dialog open={toggle.isOpen} onOpenChange={toggle.onToggle}>
      <DialogTrigger className="relative">
        <Button
          className="h-8 w-8 rounded-full transition-all hover:border"
          variant="ghost"
          size="xs"
        >
          <Icon
            remixIconClass="ri-swap-line"
            className="rotate-45"
            size="lg"
            color="gray"
          />
        </Button>
        {!selectedStore?.id || !selectedSubsidiary?.id ? (
          <div className="absolute left-6 top-0 h-2 w-2 rounded-full bg-atomic-tangerine-500">
            <div className="h-full w-full animate-ping rounded-full bg-atomic-tangerine-500"></div>
          </div>
        ) : null}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Selecciona una tienda y sucursal</DialogTitle>
          <DialogDescription>
            Para poder visualizar los apartados disponibles en la aplicación
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-1">
          <div>
            <Label>Tienda</Label>
            <div className="flex flex-row items-center justify-center gap-2">
              <Select
                value={selectedStore?.name ? selectedStore?.name : ""}
                onValueChange={onChangeStore}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona una tienda" />
                </SelectTrigger>
                <SelectContent>
                  {storeLoading ? (
                    <Loader2Icon className="text-atomic-900 h-5 w-5 animate-spin" />
                  ) : null}
                  <SelectGroup>
                    {Array.isArray(stores) && stores.length ? (
                      stores.map((store) => (
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
            </div>
          </div>
          <div>
            <Label>Sucursal</Label>
            <div className="flex flex-row items-center justify-center gap-2">
              <Select
                value={selectedSubsidiary?.name ? selectedSubsidiary?.name : ""}
                onValueChange={onChangeSubsidiary}
                disabled={storeLoading as boolean}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona una sucursal" />
                </SelectTrigger>
                <SelectContent>
                  {subsidiaryLoading ? (
                    <Loader2Icon className="text-atomic-900 h-5 w-5 animate-spin" />
                  ) : null}
                  <SelectGroup>
                    {Array.isArray(subsidiaries) && subsidiaries.length ? (
                      subsidiaries.map((subsidiary) => (
                        <SelectItem
                          key={subsidiary.id}
                          value={subsidiary?.name ?? ""}
                        >
                          {subsidiary.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem
                        value="sucursal 1"
                        className="text-xs font-normal text-gray-500"
                      >
                        No se encontraron sucursales
                      </SelectItem>
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <SubsidiaryDialog />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default StoreSubsidiaryDialog