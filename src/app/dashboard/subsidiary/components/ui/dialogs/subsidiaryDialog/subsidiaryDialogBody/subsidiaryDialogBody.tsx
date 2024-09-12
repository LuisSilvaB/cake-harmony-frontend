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
import React, { useEffect } from 'react';
import { FieldErrors, SubmitHandler, useFormContext } from 'react-hook-form';
import { FaSpinner } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useRouter } from 'next/navigation';
import { Loader2Icon } from 'lucide-react';
import { SubsidiaryType } from '@/app/dashboard/subsidiary/types/subsidiary.type';
import { createSubsidiaryFeature } from '@/app/dashboard/subsidiary/feature/subsidiary.feature';

const SubsidiaryDialogBody = () => {
  const { storeId } = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>()
  const session = useSession()
  const toggle = useToggle()  
  const loadingCreateStore = useSelector<RootState>(state => state.store.loading)
  const storesSelector = useSelector((state: RootState) => state.store);
  const storeLoadingSelector = useSelector((state: RootState) => state.store.loading);    
  const selectedStoreSelector = useSelector((state: RootState) => state.store.selectedStore);

  useEffect(() => {
    const fetchStores = async () => {
      if (session?.user?.id && !storesSelector.stores.length) {
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
  }, [dispatch, session?.user?.id, storeId]);

  const {
    control,
    formState: { isValid },
    handleSubmit,
    setValue, 
  } = useFormContext<Omit<SubsidiaryType, "id" | "created_at">>();
  
  const onSubmit: SubmitHandler<Omit<SubsidiaryType, "id" | "created_at">> = async (data) => {
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
        router.push(
          `/dashboard/pointOfSale/store/${storeId ?? selectedStoreSelector?.id ?? 0}/subsidiary/${subsudiary.payload[0].id}`,
        ); 
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
    setValue("name", "");
    setValue("description", "");
    toggle.onClose();
  }

  const onChangeStore = (e:any) => {
    const store = storesSelector.stores.find((store) => store.name === e)
    setValue("STORE_ID", store?.id ?? 0);
  }

  return (
    <Dialog open={toggle.isOpen} onOpenChange={onClose}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger
            onClick={toggle.onOpen}
            className="h-8 min-w-8 rounded-lg bg-atomic-tangerine-500 hover:bg-atomic-tangerine-600"
          >
            <Icon remixIconClass="ri-add-line" size="xs" color="white" />
          </TooltipTrigger>
          <TooltipContent
            sideOffset={5}
            className="border bg-white text-xs font-normal text-gray-500 shadow-xl"
          >
            <p className="text-sm">Agregar nueva sucursal</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit, onError)}>
          <DialogHeader>
            <DialogTitle>Agregar una sucursal</DialogTitle>
            <DialogDescription className="text-sm font-normal">
              Registre los datos correspondientes a la sucursal que desea
              agregar.
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
              <Label className="text-xs font-normal mb-3">Sucursal</Label>
              <Select
                value={selectedStoreSelector?.name}
                onValueChange={onChangeStore}
              >
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
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="hover:text-whte mt-2 flex gap-2 border-atomic-tangerine-100 bg-atomic-tangerine-500 text-xs hover:bg-atomic-tangerine-600 hover:shadow-md"
              disabled={loadingCreateStore as boolean}
            >
              {loadingCreateStore ? (
                <FaSpinner className="h-5 w-5 animate-spin text-white" />
              ) : (
                "Crear tienda"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default SubsidiaryDialogBody