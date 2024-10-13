import { productsType } from '@/app/dashboard/globalProducts/types/globalProducts.type'
import { ProductSchemaType } from '@/app/dashboard/products/store/[storeId]/schema/product.schema'
import { TagsType } from '@/app/dashboard/tags/types/tags.type'
import { Button, Input, Label } from '@/components/ui'
import { Badge } from '@/components/ui/badge'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { DialogContent, Dialog, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import Icon from '@/components/ui/icon'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import useToggle from '@/hooks/useToggle.hook'
import { Check, ChevronsUpDown } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { variantsType } from '../../../../../types/products.type'
import { uploadFile } from '@/libs/supabase/s3'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'

type ProductsDialogBodyProps = {
  product?: productsType; 
  tags:TagsType[]; 
  loadingTags:boolean;
}

const ProductsDialogBody = ( { product, tags = [], loadingTags = false }: ProductsDialogBodyProps) => {
  const toggle = useToggle()
  const { selectedStore } = useSelector((state: RootState) => state.store)
  const { control, handleSubmit, formState: { isValid }, setValue, getValues, watch, reset } = useFormContext<ProductSchemaType>()
  const mainTags = tags.filter((tags:TagsType) => !tags.id_main_tag)
  const childrenTags = tags.filter((tags:TagsType) => tags.id_main_tag)
  const [childrenTagsOptions, setChildrenTagsOptions] = useState<
    Array<{
      value: string;
      label: string;
    }>
  >([]);
  let mainTagsOptions = []
  
  mainTagsOptions = mainTags.map(
    (tag: TagsType) => ({
      value: tag.name.toLowerCase(),
      label: tag.name,
    }),
  );

  const toggleComboboxCategory = useToggle()
  const toggleComboboxCategoryChildren = useToggle()
  
  const onChangeMainTag = (value: string) => {
    const selectedMainTag = mainTags.find((tag:TagsType)=> tag.name.toLowerCase() === value)
    if(!selectedMainTag) return 
      setValue("MAIN_TAG", [{
        id: selectedMainTag.id,
        name: selectedMainTag.name,
        color: selectedMainTag.color ?? "",
        created_at: selectedMainTag.created_at,
        id_main_tag: selectedMainTag.id_main_tag,
      }]);
      setValue("TAGS", []);
  }

  const onDeleteMainTag = () => {
    setValue("MAIN_TAG",[]); 
    setValue("TAGS",[])
    setChildrenTagsOptions([])
  }

  const onChangeTag = (value: string) => {
    const selectedTag = childrenTags.find((tag: TagsType) => tag.name.toLowerCase() === value);
    const tags = getValues("TAGS");

    if (!selectedTag) return;
    const tagExists = tags.some((tag: any) => tag.id === selectedTag.id);
    
    if (!tagExists) {
      const updatedTags = [...tags, {
        id: selectedTag.id,
        name: selectedTag.name,
        color: selectedTag.color ?? "",
        created_at: selectedTag.created_at,   
        id_main_tag: selectedTag.id_main_tag,
      }];
      
      setValue("TAGS", updatedTags);
    }
  }
  
  const onDeleteTag = ( idTag: number) => {
    const tags = getValues("TAGS");
    setValue("TAGS", tags.filter((tag: any) => tag.id !== idTag));
  }

  const onAddVariant = (e: any) => {
    const maxVariants = 4;
    e.preventDefault();
    
    const variants = watch("VARIANTS") ?? [];
  
    if (variants.length >= maxVariants) return;
  
    // Agregar una nueva variante
    setValue("VARIANTS", [...variants, {
      id: 0, 
      created_at: "",
      PRODUCT_ID: 0,
      presentation: "",
      unid: "",
    }]);
  };

  const onChangeVariantValue = (key: number, value: string) =>{
    const variants = getValues("VARIANTS") ?? [];
    variants[key].presentation = value;
    setValue("VARIANTS", variants);   
  }

  const onDeleteVariant = (e: any, key: number) =>{
    e.preventDefault();
    const variants = getValues("VARIANTS") ?? [];
    setValue("VARIANTS", variants.filter((variant: any, index: number) => index !== key));
  }

  const onCloseDialog = () => {
    reset();
    toggle.onClose();
  }
  

  useEffect(()=> {
    if (!getValues("MAIN_TAG").length) {
      setValue("TAGS", []);
    }else {
        const childrenTagsByMainTag = childrenTags.filter(
          (tag: TagsType) => tag.id_main_tag === getValues("MAIN_TAG")[0]?.id,
        );
        setChildrenTagsOptions(
          childrenTagsByMainTag.map((tag: any) => ({
            value: tag.name.toLowerCase(),
            label: tag.name,
          })),
        );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[getValues("MAIN_TAG")[0]])

  const uploadImage = async (e: any) => {
    const file = e.target.files[0];
    const images_files = watch("images_files") ?? [];
    setValue("images_files", [...images_files, file]);
    console.log(watch("images_files"));
    // if(!selectedStore) return;
    // const data = await uploadFile(file, `stores/${selectedStore?.id}/products/${file.name}`);
    // if (!data) return;
    // const image_url = getValues("image_url") ?? [];
    // setValue("image_url",[...image_url, data.fullPath]);
    // console.log(data);
  }

  
  return (
    <Dialog open={toggle.isOpen} onOpenChange={onCloseDialog}>
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
      <DialogContent size="large" className="mt-4 overflow-y-auto">
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
          <div>
            <div className="flex grow flex-row gap-2">
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
            <div className="flex grow flex-row gap-2">
              <FormField
                control={control}
                name="TAGS"
                render={({ field }) => {
                  return (
                    <FormItem className="mt-3 flex-1">
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
                              opciones
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
                                        onChangeMainTag(currentValue);
                                        toggleComboboxCategory.onClose();
                                      }}
                                    >
                                      {tag.label}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                      {getValues("MAIN_TAG").length
                        ? getValues("MAIN_TAG").map(
                            (tag: any, index: number) => (
                              <Badge
                                key={index}
                                style={{
                                  backgroundColor: tag.color,
                                }}
                                className="flex w-fit flex-row gap-2"
                              >
                                <span>{tag.name}</span>
                                <div
                                  onClick={onDeleteMainTag}
                                  className="cursor-pointer rounded-lg px-1 transition-all ease-in-out hover:bg-gray-200"
                                >
                                  <Icon
                                    remixIconClass="ri-close-line"
                                    size="xs"
                                    color="white"
                                  />
                                </div>
                              </Badge>
                            ),
                          )
                        : null}
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={control}
                name="TAGS"
                render={({ field }) => {
                  return (
                    <FormItem className="mt-3 flex-1">
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
                              opciones
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
                                  {childrenTagsOptions.map((tag) => (
                                    <CommandItem
                                      key={tag.value}
                                      value={tag.value}
                                      onSelect={(currentValue) => {
                                        onChangeTag(currentValue);
                                        toggleComboboxCategoryChildren.onClose();
                                      }}
                                    >
                                      {tag.label}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                      {getValues("TAGS").length
                        ? getValues("TAGS").map((tag: any, index: number) => (
                            <Badge
                              key={index}
                              style={{
                                backgroundColor: tag.color,
                              }}
                              className="flex w-fit flex-row gap-2"
                            >
                              <span>{tag.name}</span>
                              <div
                                onClick={() => onDeleteTag(tag.id)}
                                className="hover:bg-light-gray cursor-pointer rounded-lg px-1 transition-all ease-in-out hover:bg-gray-200 hover:text-black"
                              >
                                <Icon
                                  remixIconClass="ri-close-line"
                                  size="xs"
                                  color="white"
                                />
                              </div>
                            </Badge>
                          ))
                        : null}
                    </FormItem>
                  );
                }}
              />
            </div>
            <Label>Variantes</Label>
            <div className="mb-2 mt-2 flex flex-col gap-2">
              {watch("VARIANTS") && watch("VARIANTS")?.length
                ? watch("VARIANTS")?.map(
                    (variant: variantsType, index: number) => (
                      <div className="flex flex-row gap-2" key={index}>
                        <Input
                          key={index}
                          type="text"
                          placeholder="Presentación"
                          className="min-w-56 border"
                          value={variant.presentation}
                          onChange={(e) => {
                            onChangeVariantValue(index, e.target.value);
                          }}
                        />
                        <Button
                          size="xs"
                          variant="destructive"
                          onClick={(e) => onDeleteVariant(e, index)}
                        >
                          <Icon
                            remixIconClass="ri-delete-bin-line"
                            size="xs"
                            color="white"
                          />
                        </Button>
                      </div>
                    ),
                  )
                : null}
            </div>
            <Button
              size="sm"
              className="w-full"
              onClick={(e) => {
                onAddVariant(e);
              }}
            >
              Agregar variante
            </Button>
            <FormField
              control={control}
              name="images_files"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Imagenes</FormLabel>
                    <FormControl>
                      <Input type="file" onChange={uploadImage} />
                    </FormControl>
                  </FormItem>
                );
              }}
            />
            <div className='flex flex-row gap-2 rounded-lg flex-wrap mt-2'>
              {watch("images_files") && watch("images_files")?.length
                ? watch("images_files")?.map((image: File, index: number) => (
                    <div key={index} className='relative' >
                      <div className='absolute -top-2 -right-2  border px-1 bg-white rounded-full opacity-70 hover:opacity-100 cursor-pointer transition-all ease-in-out'>
                        <Icon remixIconClass='ri-close-circle-fill' color='red' className='hover:text-red-900' />
                      </div>
                      <div className='absolute -top-2 right-6  border px-1 bg-white rounded-full opacity-70 hover:opacity-100 cursor-pointer transition-all ease-in-out'>
                        <Icon remixIconClass='ri-eye-fill' color='blue' className='hover:text-red-900' />
                      </div>
                      <img src={URL.createObjectURL(image)} alt="product image" className='max-w-30 h-20 border rounded-lg shadow-xl' />
                    </div>
                  ))
                : null}
            </div>
            {/* {
              watch("image_url") && watch("image_url")?.length
              ? watch("image_url")?.map((image: any, index: number) => (
                  <div className="flex flex-row gap-2" key={index}>
                    <img src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${image}`} alt='product' className="w-20 h-20 rounded-lg" />
                    <div
                      // onClick={() => onDeleteImage(index)}
                      className="hover:bg-light-gray cursor-pointer rounded-lg px-1 transition-all ease-in-out hover:bg-gray-200 hover:text-black"
                    >
                      <Icon
                        remixIconClass="ri-close-line"
                        size="xs"
                        color="white"
                      />
                    </div>
                  </div>
                )): null
            } */}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ProductsDialogBody