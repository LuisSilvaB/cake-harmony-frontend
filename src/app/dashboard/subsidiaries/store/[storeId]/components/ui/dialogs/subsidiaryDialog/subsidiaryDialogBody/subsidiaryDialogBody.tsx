'use client'
import { createStoreFeature, getStoresFeature, setSelectedStore } from '@/app/dashboard/store/feature/store.feature';
import { StoreType } from '@/app/dashboard/store/types/store.type';
import {
  Button,
  Input,
  Label,
  Select,
  SelectGroup,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import Icon from '@/components/ui/icon';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from '@/hooks/useToast';
import useToggle from '@/hooks/useToggle.hook';
import useSession from '@/libs/supabase/use-session';
import { AppDispatch, RootState } from '@/redux/store';
import React, { useEffect, useState } from 'react';
import { FieldErrors, SubmitHandler, useFormContext } from 'react-hook-form';
import { FaSpinner } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useRouter } from 'next/navigation';
import { Loader2Icon } from 'lucide-react';
import { SubsidiaryType } from '@/app/dashboard/subsidiaries/store/[storeId]/types/subsidiary.type';
import { createSubsidiaryFeature, updateSubsidiaryFeature } from '@/app/dashboard/subsidiaries/store/[storeId]/feature/subsidiary.feature';

type SubsidiaryDialogBodyProps = {
  subsidiary?: SubsidiaryType; 
}

const SubsidiaryDialogBody = ({ subsidiary } : SubsidiaryDialogBodyProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const session = useSession()
  const toggle = useToggle()  
  const loadingCreateStore = useSelector<RootState>(state => state.store.loading)
  const { loading, stores, selectedStore } = useSelector((state: RootState) => state.store);
  const { loadingCreateSubsidiary, loadingUpdateSubsidiary } = useSelector((state: RootState) => state.subsidiary);
  useEffect(() => {
    const fetchStores = async () => {
      if (session?.user?.id && !stores.length) {
        const data = await dispatch(getStoresFeature({
          userId: session?.user?.id
        }));

        if(Array.isArray(data.payload) && storeId){
          const store:StoreType = data.payload.find(store => store.id === Number(storeId));
          setSelectedStore(store);
        }
      }
    }

    fetchStores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, session?.user?.id]);

  const {
    control,
    formState: { isValid },
    handleSubmit,
    setValue, 
    getValues,
  } = useFormContext<Omit<SubsidiaryType, "id" | "created_at">>();
  const storeId = getValues("STORE_ID");
  const onCreateSubsidiary: SubmitHandler<Omit<SubsidiaryType, "id" | "created_at">> = async (data) => {
    try {
      if (!isValid || !session?.user) {
        toast({
          title: "Error",
          description: "Complete los campos requeridos",
          duration: 5000,
        });
        return
      }
      const subsudiary = await dispatch(
        createSubsidiaryFeature({ subsidiaryToCreate: data })
      );
      if (!subsudiary) return;

      if (Array.isArray(subsudiary.payload)) {
        toggle.onClose();
      };
      
    } catch (error) {
      return; 
    }
  }

  const onUpdateSubsidiary: SubmitHandler<Omit<SubsidiaryType, "id" | "created_at">> = async (data) => {
    try {
      if (!isValid || !session?.user) {
        toast({
          title: "Error",
          description: "Complete los campos requeridos",
          duration: 5000,
        });
        return
      }
      const subsudiary = await dispatch(
        updateSubsidiaryFeature({ changes: data, subsidiaryId: Number(subsidiary?.id ?? 0) })
      );
      if (!subsudiary) return;

      if (Array.isArray(subsudiary.payload)) {
        toggle.onClose();
      };
      
    } catch (error) {
      return; 
    }
  }
 
  const onError = (error: FieldErrors<Omit<StoreType, "id" | "created_at">>) => {
    toast({
      title: "Vefifique los campos ingresados",
      description: "Error al registrar",
      duration: 5000,
      variant: "destructive"
    });
  }

  useEffect(() => {
    if (subsidiary) {
      setValue("name", subsidiary.name);
      setValue("description", subsidiary.description);
    }else{
      setValue("name", "");
      setValue("description", "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Dialog open={toggle.isOpen} onOpenChange={toggle.onClose}>
      <TooltipProvider>
        {subsidiary ? (
          <Tooltip>
            <TooltipTrigger>
              <Button
                onClick={toggle.onOpen}
                size={"xs"}
                variant="secondary"
                className="items-center justify-center rounded-lg"
              >
                <Icon remixIconClass="ri-pencil-line" size="md" color="gray" />
              </Button>
            </TooltipTrigger>
            <TooltipContent
              sideOffset={5}
              className="border bg-white text-xs font-normal text-gray-500 shadow-xl"
            >
              <p className="text-sm">Editar tienda</p>
            </TooltipContent>
          </Tooltip>
        ) : (
          <Tooltip>
            <TooltipTrigger>
              <Button
                onClick={toggle.onOpen}
                size={"sm"}
                className="items-center justify-center rounded-lg bg-atomic-tangerine-500 hover:bg-atomic-tangerine-600"
              >
                <Icon remixIconClass="ri-add-line" size="md" color="white" />
              </Button>
            </TooltipTrigger>
            <TooltipContent
              sideOffset={5}
              className="border bg-white text-xs font-normal text-gray-500 shadow-xl"
            >
              <p className="text-sm">Agregar nueva tienda</p>
            </TooltipContent>
          </Tooltip>
        )}
      </TooltipProvider>
      <DialogContent className="sm:max-w-[425px]">
        <form
          onSubmit={
            subsidiary
              ? handleSubmit(onUpdateSubsidiary, onError)
              : handleSubmit(onCreateSubsidiary, onError)
          }
        >
          <DialogHeader>
            <DialogTitle>
              {subsidiary ? "Editar sucursal" : "Agregar una sucursal"}
            </DialogTitle>
            <DialogDescription className="text-sm font-normal">
              {subsidiary
                ? "Edite los datos correspondientes a la sucursal."
                : "Registre los datos correspondientes a la sucursal que desea agregar."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="w-full">
              <FormField
                control={control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input
                        value={field.value}
                        onChange={field.onChange}
                        type="text"
                        placeholder="Nombre"
                        className="min-w-56 border"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-full">
              <FormField
                control={control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                      <Input
                        value={field.value}
                        onChange={field.onChange}
                        type="text"
                        placeholder="Descripción"
                        className="min-w-56 border"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-full">
              <Label className="mb-3 text-xs font-normal">Tienda</Label>
              <Select
                value={
                  selectedStore ? selectedStore.name : "selecciona una tienda"
                }
                disabled={selectedStore ? true : false}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona una tienda" />
                </SelectTrigger>
                <SelectContent>
                  {loading ? (
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
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="hover:text-whte mt-2 flex gap-2 border-atomic-tangerine-100 bg-atomic-tangerine-500 text-xs hover:bg-atomic-tangerine-600 hover:shadow-md"
              disabled={
                (loadingCreateSubsidiary || loadingUpdateSubsidiary) as boolean
              }
            >
              {subsidiary ? "Editar sucursal" : "Crear sucursal"}
              {loadingCreateSubsidiary ? (
                <div className="animate-spin">
                  <Icon
                    remixIconClass="ri-loader-4-line"
                    color="white"
                    size="xl"
                  />
                </div>
              ) : null}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default SubsidiaryDialogBody