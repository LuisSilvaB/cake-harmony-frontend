import { productsType } from '@/app/dashboard/globalProducts/types/globalProducts.type'
import { ProductSchemaType } from '@/app/dashboard/products/schema/product.schema'
import { Button, Input } from '@/components/ui'
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import Icon from '@/components/ui/icon'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import useToggle from '@/hooks/useToggle.hook'
import { Dialog } from '@radix-ui/react-dialog'
import React from 'react'
import { useFormContext } from 'react-hook-form'

type ProductsDialogBodyProps = {
  product?: productsType
}

const ProductsDialogBody = ( { product }: ProductsDialogBodyProps) => {
  const toggle = useToggle()
  const { control, handleSubmit, formState: { isValid } } = useFormContext<ProductSchemaType>()
  return (
    <Dialog open={toggle.isOpen} onOpenChange={toggle.onClose}>
      <TooltipProvider>
        {product ? (
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
              <p className="text-sm">Editar Producto</p>
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
              <p className="text-sm">Agregar nueva Producto</p>
            </TooltipContent>
          </Tooltip>
        )}
      </TooltipProvider>
      <DialogContent>
        <form>
          <DialogHeader>
            <DialogTitle>
              {product ? "Editar Producto" : "Agregar un Producto"}
            </DialogTitle>
            <DialogDescription className="text-sm font-normal">
              {product
                ? "Edite los datos correspondientes a tu Producto."
                : "Registre los datos correspondientes a tu Producto."}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 h-full w-full">
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
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ProductsDialogBody