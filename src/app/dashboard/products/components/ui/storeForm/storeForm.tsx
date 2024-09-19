import { StoreSchema } from '@/app/dashboard/store/schema/store.schema';
import { StoreType } from '@/app/dashboard/store/types/store.type';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input } from '@/components/ui';
import React from 'react'
import { FieldErrors, FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { FaSpinner } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import useSession from '@/libs/supabase/use-session';
import useToggle from '@/hooks/useToggle.hook';
import { toast } from '@/hooks/useToast';
import { createStoreFeature } from '@/app/dashboard/store/feature/store.feature';
import { useRouter } from 'next/navigation';

const StoreForm = () => {
  const dispatch = useDispatch<AppDispatch>()
  const session = useSession()
  const router = useRouter();

  const loadingCreateStore = useSelector<RootState>(state => state.store.loading)

  const defaultValues = {
    name: "",
    description: "",
  }

  const formMetods = useForm<Omit<StoreType, "id" | "created_at">>({
    resolver: zodResolver(StoreSchema),
    defaultValues,
    mode: "all",
    reValidateMode: "onSubmit",
  });

  const onSubmit: SubmitHandler<Omit<StoreType, "id" | "created_at">> = async (data) => {
    try {
      if (!formMetods.formState.isValid || !session?.user) {
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
        formMetods.reset();
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


  return (
    <FormProvider {...formMetods}>
      <form onSubmit={formMetods.handleSubmit(onSubmit, onError)}>
        <div className="flex flex-col w-full gap-4 py-4">
          <div className="w-full">
            <FormField
              control={formMetods.control}
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
                      className="min-w-56 w-full border"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="w-full">
            <FormField
              control={formMetods.control}
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
        <div className="flex w-full justify-end">
          <Button
            type="submit"
            size={"xs"}
            className="hover:text-whte mt-2 flex gap-2 border-atomic-tangerine-100 bg-atomic-tangerine-500 text-xs hover:bg-atomic-tangerine-600 hover:shadow-md"
            disabled={loadingCreateStore as boolean}
          >
            {loadingCreateStore ? (
              <FaSpinner className="h-5 w-5 animate-spin text-white" />
            ) : (
              "Crear tienda"
            )}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}

export default StoreForm