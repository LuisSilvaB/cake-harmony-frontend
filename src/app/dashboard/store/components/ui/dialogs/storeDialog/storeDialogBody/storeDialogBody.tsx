import { createStoreFeature, updateStoreFeature } from '@/app/dashboard/store/feature/store.feature';
import { StoreType } from '@/app/dashboard/store/types/store.type';
import { Button, Input, Label } from '@/components/ui';
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
import React, { useEffect } from 'react';
import { FieldErrors, SubmitHandler, useFormContext } from 'react-hook-form';
import { FaSpinner } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';

type StoreDialogBodyProps = {
  store?: StoreType
}

const StoreDialogBody = ( { store }: StoreDialogBodyProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const session = useSession()
  const toggle = useToggle()  
  const { loadingCreateStore, loadingUpdateStore } = useSelector(
    (state: RootState) => state.store,
  );
  const {
    control,
    formState: { isValid },
    handleSubmit,
    setValue, 
  } = useFormContext<Omit<StoreType, "id" | "created_at">>(); 
  
  const onSubmitCreate: SubmitHandler<Omit<StoreType, "id" | "created_at">> = async (data) => {
    try {
      if (!isValid || !session?.user) {
        toast({
          title: "Error",
          description: "Complete los campos requeridos",
          duration: 5000,
        });
        return
      }
      const store = await dispatch(
        createStoreFeature({ storeToCreate: data, userId: session.user.id }),
      );
      if (!store) return;

      if (Array.isArray(store.payload)) {
        toggle.onClose();
      };
      
    } catch (error) {
      return; 
    }
  }

  const onSubmitUpdate: SubmitHandler<Omit<StoreType, "id" | "created_at">> = async (data) => {
    try {
      if (!isValid || !session?.user) {
        toast({
          title: "Error",
          description: "Complete los campos requeridos",
          duration: 5000,
        });
        return
      }
      const newStore = await dispatch(
        updateStoreFeature({ changes: data, storeId: Number(store?.id ?? 0), userId: session.user.id }),
      );
      if (!store) return;

      if (Array.isArray(newStore.payload)) {
        toggle.onClose();
      };
      
    } catch (error) {
      return; 
    }
  }

  const onError = (error: FieldErrors<Omit<StoreType, "id" | "created_at">>) => {
    console.log("Form error:", error);
    toast({
      title: "Vefifique los campos ingresados",
      description: "Error al registrar",
      duration: 5000,
      variant: "destructive"
    });
  }

  const onClose = () => {
    toggle.onClose();
  }

  useEffect(()=>{
    if(store) {
      setValue("name", store.name);
      setValue("description", store.description);
    } else {
      setValue("name", "");
      setValue("description", "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  return (
    <Dialog open={toggle.isOpen} onOpenChange={onClose}>
      <TooltipProvider>
        {store ? (
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
            store
              ? handleSubmit(onSubmitUpdate, onError)
              : handleSubmit(onSubmitCreate, onError)
          }
        >
          <DialogHeader>
            <DialogTitle>
              {store ? "Editar tienda" : "Agregar una tienda"}
            </DialogTitle>
            <DialogDescription className="text-sm font-normal">
              {store
                ? "Edite los datos correspondientes a la tienda que desea editar."
                : "Registre los datos correspondientes a la tienda que desea agregar."}
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
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="hover:text-whte mt-2 flex flex-row items-center gap-2 border-atomic-tangerine-100 bg-atomic-tangerine-500 text-xs hover:bg-atomic-tangerine-600 hover:shadow-md"
              disabled={loadingCreateStore as boolean}
            >
              {store ? "Editar tienda" : "Crear tienda"}

              {loadingCreateStore || loadingUpdateStore ? (
                <div className='animate-spin'>
                  <Icon remixIconClass='ri-loader-4-line' color='white' size='xl' />
                </div>
              ) : null}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default StoreDialogBody