import React, { useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import Icon from '@/components/ui/icon';
import { FormControl, FormField, FormItem } from '@/components/ui/form';
import { Button, Input, Label } from '@/components/ui';
import { SubmitHandler, useFormContext } from 'react-hook-form';
import { StoreType } from '@/app/dashboard/[storeId]/types/store.type';
import { useParams } from 'next/navigation';
const CreateStoreDialogBody = () => {

  const {
    control,
    formState: { isValid },
    handleSubmit,
    setValue, 
  } = useFormContext<Omit<StoreType, "id" | "created_at">>(); 
  
  const onSubmit: SubmitHandler<Omit<StoreType, "id" | "created_at">> = async (data) => {
    console.log(data)
  }

  useEffect(()=>{
    return () => { 
      setValue("name", "");
      setValue("description", "");
     }
  }, [])

  return (
    <Dialog>
      <DialogTrigger>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="h-8 w-8 rounded-lg bg-atomic-tangerine-300 hover:bg-atomic-tangerine-400">
              <Icon remixIconClass="ri-add-line" size="xs" color="white" />
            </TooltipTrigger>
            <TooltipContent
              sideOffset={5}
              className="border bg-white text-xs font-normal text-gray-500 shadow-xl"
            >
              <p className="text-sm">Agregar nueva tienda</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </DialogTrigger>
      <form>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Agregar una tienda</DialogTitle>
            <DialogDescription className="text-sm font-normal">
              Registre los datos correspondientes a la tienda que desea agregar.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="w-full">
              <Label htmlFor="name" className="text-right">
                Nombre
              </Label>
              <FormField
                control={control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        value={field.value}
                        onChange={field.onChange}
                        type="text"
                        placeholder="Name"
                        className="min-w-56 border"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="w-full">
              <Label htmlFor="name" className="text-right">
                Descriptión
              </Label>
              <FormField
                control={control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        value={field.value}
                        onChange={field.onChange}
                        type="text"
                        placeholder="Descripción"
                        className="min-w-56 border"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="hover:text-whte mt-2 flex gap-2 border-atomic-tangerine-100 bg-atomic-tangerine-500 text-xs hover:bg-atomic-tangerine-600 hover:shadow-md"
            >
              Crear tienda
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}

export default CreateStoreDialogBody