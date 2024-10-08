import { productsType } from '@/app/dashboard/globalProducts/types/globalProducts.type'
import { ProductSchemaType } from '@/app/dashboard/products/store/[storeId]/schema/product.schema'
import { TagsType } from '@/app/dashboard/tags/types/tags.type'
import { Button, Input } from '@/components/ui'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { DialogContent, Dialog, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import Icon from '@/components/ui/icon'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import useToggle from '@/hooks/useToggle.hook'
import { cn } from '@/utils/cn'
import { Check, ChevronsUpDown } from 'lucide-react'
import React, { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'

type ProductsDialogBodyProps = {
  product?: productsType; 
  tags:TagsType[]; 
  loadingTags:boolean;
}

const ProductsDialogBody = ( { product, tags = [], loadingTags = false }: ProductsDialogBodyProps) => {
  const toggle = useToggle()
  const { control, handleSubmit, formState: { isValid }, setValue, getValues } = useFormContext<ProductSchemaType>()
  const mainTags = tags.filter((tags:TagsType) => !tags.id_main_tag)
  const childrenTags = tags.filter((tags:TagsType) => tags.id_main_tag)
  let childrenTagsOptions = []
  let mainTagsOptions = []

  mainTagsOptions = mainTags.map(
    (tag: TagsType) => ({
      value: tag.name.toLowerCase(),
      label: tag.name,
    }),
  );
  const tagsOptions = mainTags.map(
    (tag: TagsType) => ({
      value: tag.name.toLowerCase(),
      label: tag.name,
    }),
  );

  const toggleComboboxCategory = useToggle()
  const toggleComboboxCategoryChildren = useToggle()
  
  const onChangeMainTag = (value: string) => {
    const productsTags = getValues("TAGS")
    // const isThereMainTag = productsTags.find((tag: TagsType) => !tag.id_main_tag)
    setValue("TAGS", [])
  }

  useEffect(()=> {

    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

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
            <FormField 
              control={control}
              name="TAGS"
              render={({ field }) => {
                return (
                  <FormItem className='mt-3'>
                    <FormLabel>Categorías</FormLabel>
                    <FormControl>
                      <Popover
                        open={toggleComboboxCategory.isOpen}
                        onOpenChange={toggleComboboxCategory.onToggle}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            className="w-full justify-between"
                          >
                            Seleccione una categoria
                            {/* {
                          field.value
                          ? mainTags.find((mainTag)=> mainTag.id === field.value)?.name
                          : "Seleccione una categoria"
                        } */}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent align="start">
                          <Command>
                            <CommandInput placeholder="Buscar categoria..." />
                            <CommandList>
                              <CommandEmpty>
                                Categorias no encontnradas
                              </CommandEmpty>
                              <CommandGroup>
                                {mainTagsOptions.map((tag) => (
                                  <CommandItem
                                    key={tag.value}
                                    value={tag.value}
                                    onSelect={(currentValue) => {
                                      // setValue("id_main_tag", mainTags.find((mainTag)=> mainTag.name.toLowerCase() === currentValue)?.id ?? 0);
                                      toggleComboboxCategory.onClose();
                                    }}
                                  >
                                    {/* <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  tags.find((mainTag)=> mainTag.name.toLowerCase() === tag.value.toLowerCase())?.id === field.value 
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              /> */}
                                    {tag.label}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                  </FormItem>
                );
              }}
            />
                        <FormField 
              control={control}
              name="TAGS"
              render={({ field }) => {
                return (
                  <FormItem className='mt-3'>
                    <FormLabel>Subcategorías</FormLabel>
                    <FormControl>
                      <Popover
                        open={toggleComboboxCategoryChildren.isOpen}
                        onOpenChange={toggleComboboxCategoryChildren.onToggle}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            className="w-full justify-between"
                          >
                            Seleccione una subcategoria
                            {/* {
                          field.value
                          ? mainTags.find((mainTag)=> mainTag.id === field.value)?.name
                          : "Seleccione una categoria"
                        } */}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent align="start">
                          <Command>
                            <CommandInput placeholder="Buscar categoria..." />
                            <CommandList>
                              <CommandEmpty>
                                Subcategorías no encontradas
                              </CommandEmpty>
                              <CommandGroup>
                                {mainTagsOptions.map((tag) => (
                                  <CommandItem
                                    key={tag.value}
                                    value={tag.value}
                                    onSelect={(currentValue) => {
                                      // setValue("id_main_tag", mainTags.find((mainTag)=> mainTag.name.toLowerCase() === currentValue)?.id ?? 0);
                                      toggleComboboxCategoryChildren.onClose();
                                    }}
                                  >
                                    {/* <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  tags.find((mainTag)=> mainTag.name.toLowerCase() === tag.value.toLowerCase())?.id === field.value 
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              /> */}
                                    {tag.label}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                  </FormItem>
                );
              }}
            />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ProductsDialogBody