import { createStoreFeature } from '@/app/dashboard/store/feature/store.feature';
import { StoreType } from '@/app/dashboard/store/types/store.type';
import { Button, Input, Label } from '@/components/ui';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { getAllGlobalProducts, setSearchGlobalProducts } from '@/app/dashboard/global-products/feature/global-products.feature';
import { onSearchGlobalProducts } from '@/app/dashboard/global-products/feature/global-products.feature';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { GlobalProductsTagsType, GlobalProductsType } from '@/app/dashboard/global-products/types/global-products.type';
import { Badge } from '@/components/ui/badge';
import { debounce } from 'lodash';

const ProductStoreDialogBody = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>()
  const session = useSession()
  const toggle = useToggle()  
  const loadingCreateStore = useSelector<RootState>(state => state.store.loading)
  const selectedStore = useSelector<RootState>(state => state.store.selectedStore)
  const loadingGlobalProducts = useSelector<RootState>(state => state.globalProducts.loadingGlobalProducts)
  const globalProducts = useSelector<RootState>(state => state.globalProducts.globalProducts)
  const searchGlobalProducts = useSelector<RootState>(state => state.globalProducts.searchGlobalProducts)

  console.log("searchGlobalProducts", searchGlobalProducts)

  const {
    control,
    formState: { isValid },
    handleSubmit,
    setValue, 
  } = useFormContext<Omit<StoreType, "id" | "created_at">>(); 
  
  const onSubmit: SubmitHandler<Omit<StoreType, "id" | "created_at">> = async (data) => {
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
        router.push(`/dashboard/${store.payload[0].id}/0`)
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

  // Get all global products

  useEffect(() => {
    if (selectedStore) {
      dispatch(getAllGlobalProducts())
    }
  }, [selectedStore, dispatch])

  const debouncedSearch = debounce((query: string) => {
    dispatch(onSearchGlobalProducts({ query }));
  }, 300);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    debouncedSearch(query);
  };


  useEffect(() => {
    return () => {
      dispatch(setSearchGlobalProducts([]))
    }
  } , [])



  return (
    <Dialog open={toggle.isOpen} onOpenChange={onClose} >
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
            <p className="text-sm">Agregar un nuevo producto</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent  size="large">
        <form onSubmit={handleSubmit(onSubmit, onError)}>
          <DialogHeader>
            <DialogTitle>Agregar un nuevo producto</DialogTitle>
            <DialogDescription className="text-sm font-normal">
              Seleccione el producto que desea agregar.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex gap-2 w-full relative">
              <Input className='w-full' placeholder="Buscar producto" type="text" name="name" onChange={handleSearchChange} />
              <Icon remixIconClass='ri-search-line' size="xs" color="gray" className='absolute right-2 top-1/2 transform -translate-y-1/2' />
            </div>
            <div className='w-full flex-col gap-2'>              
              {
                Array.isArray(searchGlobalProducts) && searchGlobalProducts.length > 0 ? searchGlobalProducts.map((product: GlobalProductsType, index: number) => (
                  <div key={index} className="flex gap-2 w-full justify-between">
                    <div>                   
                      <div className="flex gap-3 w-full">
                        <div className="flex w-fit items-center justify-center">
                          <Avatar>
                            <AvatarImage src={product.image_url[0]} alt="product img" />
                            <AvatarFallback>PI</AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="flex flex-col gap-1 w-full">
                          <p className="text-sm font-medium">{product.name}</p>
                          <p className="text-xs font-normal">{product.description}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex w-fit flex-col justify-center items-end"> 
                      {
                        product.GLOBAL_PRODUCTS_TAG.map((tag: GlobalProductsTagsType, index: number) => (
                          <div key={index}>
                          {tag.type === "CATEGORY" ? (
                            <Badge
                              style={{
                                backgroundColor: tag.TAG.color,
                              }}
                            >
                              {tag.TAG.name}
                            </Badge>
                          ) : null}
                        </div>
                        ))
                      }
                      {
                        product.GLOBAL_PRODUCTS_TAG.map((tag: GlobalProductsTagsType, index: number) => (
                          <div key={index}>
                            {tag.type === "SUB-CATEGORY" ? (
                              <Badge
                                style={{
                                  backgroundColor: tag.TAG.color,
                                }}
                              >
                                {tag.TAG.name}
                              </Badge>
                            ) : null}
                          </div>
                        ))
                      }
                    </div>
                  </div>
                )) : null
              }
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
                "Agregar producto"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ProductStoreDialogBody