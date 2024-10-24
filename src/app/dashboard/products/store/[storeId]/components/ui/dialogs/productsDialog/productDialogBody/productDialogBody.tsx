import { ProductFilesType, productsType } from "@/app/dashboard/products/store/[storeId]/types/products.type";
import { ProductSchemaType } from "@/app/dashboard/products/store/[storeId]/schema/product.schema";
import { TagsType } from "@/app/dashboard/tags/types/tags.type";
import { Button, Input, Label } from "@/components/ui";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  DialogContent,
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Icon from "@/components/ui/icon";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import useToggle from "@/hooks/useToggle.hook";
import { ChevronsUpDown } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { FieldErrors, SubmitHandler, useFormContext } from "react-hook-form";
import { variantsType } from "../../../../../types/products.type";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { toast } from "@/hooks/useToast";
import { createProductFeature, updateProductFeature } from "../../../../../feature/products.feature";

type ProductsDialogBodyProps = {
  product?: productsType;
  tags: TagsType[];
  loadingTags: boolean;
};

const ProductsDialogBody = ({
  product,
  tags = [],
  loadingTags = false,
}: ProductsDialogBodyProps) => {
  const [childrenTagsOptions, setChildrenTagsOptions] = useState<
    Array<{
      value: string;
      label: string;
    }>
  >([]);
  const toggle = useToggle(false);
  const dispatch = useDispatch<AppDispatch>();
  const { selectedStore } = useSelector((state: RootState) => state.store);
  const { loadingCreateProduct, loadingUpdateProduct } = useSelector((state: RootState) => state.products);
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    watch,
    reset,
    trigger
  } = useFormContext<ProductSchemaType>();
  const mainTags = tags.filter((tags: TagsType) => !tags.id_main_tag);
  const childrenTags = tags.filter((tags: TagsType) => tags.id_main_tag);
  const variantsCount = watch("VARIANTS")?.length ?? 0;
  const inputUploadImage = useRef<HTMLInputElement>(null);
  const maxCountVariants = 4;
  let mainTagsOptions = [];

  mainTagsOptions = mainTags.map((tag: TagsType) => ({
    value: tag.name.toLowerCase(),
    label: tag.name,
  }));

  const toggleComboboxCategory = useToggle();
  const toggleComboboxCategoryChildren = useToggle();

  const onChangeMainTag = (value: string) => {
    const selectedMainTag = mainTags.find(
      (tag: TagsType) => tag.name.toLowerCase() === value,
    );
    if (!selectedMainTag) return;
    setValue("MAIN_TAG", [
      {
        id: selectedMainTag.id,
        name: selectedMainTag.name,
        color: selectedMainTag.color ?? "",
        created_at: selectedMainTag.created_at,
        id_main_tag: selectedMainTag.id_main_tag,
      },
    ]);
    setValue("CHILD_TAGS", []);
  };

  const onDeleteMainTag = () => {
    setValue("CHILD_TAGS", []);
    setChildrenTagsOptions([]);
  };

  const onChangeTag = (value: string) => {
    const selectedTag = childrenTags.find(
      (tag: TagsType) => tag.name.toLowerCase() === value,
    );
    const tags = getValues("CHILD_TAGS");

    if (!selectedTag) return;
    const tagExists = tags.some((tag: any) => tag.id === selectedTag.id);

    if (!tagExists) {
      const updatedTags = [
        ...tags,
        {
          id: selectedTag.id,
          name: selectedTag.name,
          color: selectedTag.color ?? "",
          created_at: selectedTag.created_at,
          id_main_tag: selectedTag.id_main_tag,
        },
      ];

      setValue("CHILD_TAGS", updatedTags);
    }
  };

  const onDeleteTag = (idTag: number) => {
    const tags = getValues("CHILD_TAGS");
    setValue(
      "CHILD_TAGS",
      tags.filter((tag: any) => tag.id !== idTag),
    );
  };

  const onAddVariant = (e: any) => {
    e.preventDefault();

    const variants = watch("VARIANTS") ?? [];

    if (variants.length >= maxCountVariants) return;

    // Agregar una nueva variante
    setValue("VARIANTS", [
      ...variants,
      {
        id: 0,
        created_at: "",
        PRODUCT_ID: "",
        presentation: "",
      },
    ]);
  };

  const onChangeVariantValue = (key: number, value: string) => {
    const variants = getValues("VARIANTS") ?? [];
    variants[key].presentation = value;
    setValue("VARIANTS", variants);
  };

  const onDeleteVariant = (e: any, key: number) => {
    e.preventDefault();
    const variants = getValues("VARIANTS") ?? [];
    setValue(
      "VARIANTS",
      variants.filter((variant: any, index: number) => index !== key),
    );
  };

  const onDeleteImage = (key: number) => {
    const imagesFiles = watch("images_files") ?? [];
    if (!imagesFiles.length) return;
    setValue(
      "images_files",
      imagesFiles.filter((file: File, index: number) => index !== key),
    );
  };

  const onAddProductImage = async (e: any) => {
    try {
      const file = e.target.files[0];
      const images_files = watch("images_files") ?? [];
      if (e.target.files[0] && e.target.files[0].type !== "image/jpeg") {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Los archivos solo pueden ser jpeg",
          duration: 5000,
        });
      }
      if (
        images_files.some((file: File) => file.name === e.target.files[0].name)
      ) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Ya existe una foto de producto con ese nombre",
          duration: 5000,
        });
        return;
      }
      if (!inputUploadImage.current) return;
      inputUploadImage.current.value = "";
      setValue("images_files", [...images_files, file]);
    } catch (e) {
      toast({
        title: "Error",
        description: "No se pudo agregar el producto",
      });
      return;
    }
  };

  const onSubmitCreateProduct: SubmitHandler<Omit<ProductSchemaType, "id">> = async (
    data
  ) => {
    try {
      const isValid = await trigger();
      if (!isValid) return;
      if(!selectedStore) return;
      const product = await dispatch(
        createProductFeature({
          data: data,
          stroeId: selectedStore.id ?? 0,
        }),
      );
      toggle.onClose(); 
      reset();
    } catch (e) {
      toast({
        title: "Error",
        description: "No se pudo agregar el product",
      });
      return;
    }
  };

  const onSubmitUpateProduct = async (data: Omit<ProductSchemaType, "created_at">) => {
    try {
      const isValid = await trigger();
      if (!isValid) return;
      if(!selectedStore) return;
      const product = await dispatch(
        updateProductFeature({
          product: data,
          storeId: selectedStore.id ?? 0,
        }),
      );

      if (product.payload && !loadingUpdateProduct) {
        // toggle.onClose();
        // reset();
        console.log(product.payload)
        return toast({
          title: "Producto actualizado",
          description: "El producto se actualizó correctamente",
          variant: "default",
        });
      } else {
        return toast({
          title: "Error al crear productos",
          description: "Los datos del producto no fueron registrados",
          variant: "destructive",
        });
      }

    } catch(e){
      console.log(e)
    }
  }
  const onError = (
    error: FieldErrors<Omit<ProductSchemaType, "id" | "created_at">>,
  ) => {
    console.log(error);
    toast({
      title: "Vefifique los campos ingresados",
      description: "Error al registrar",
      duration: 5000,
      variant: "destructive",
    });
  };

  const onCloseDialog = () => {
    toggle.onClose();
  };
  console.log(product)

  useEffect(() => {
    if (!getValues("MAIN_TAG").length) {
      setValue("CHILD_TAGS", []);
    } else {
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
  }, [watch("MAIN_TAG")[0]]);

  
  useEffect(()=>{
    if(!product) return
    setValue("id", product.id)
    setValue("name", product.name)
    setValue("description", product.description)
    setValue("brand", product.brand)
    setValue("MAIN_TAG", product.PRODUCTS_TAGS.filter((tag: any) => !tag.id_main_tag))
    setValue("CHILD_TAGS", product.PRODUCTS_TAGS.filter((tag: any) => tag.id_main_tag))
    setValue("VARIANTS", product.PRODUCT_VARIANTS)
    setValue("PRODUCT_FILES", product.PRODUCT_FILES)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[product, toggle.isOpen])

  return (
    <Dialog open={toggle.isOpen} onOpenChange={onCloseDialog}>
      {product ? (
        <Button
          asChild
          onClick={toggle.onOpen}
          size={"xs"}
          variant="secondary"
          className="items-center justify-center rounded-lg cursor-pointer"
        >
          <Icon remixIconClass="ri-pencil-line" size="md" color="gray" />
        </Button>
      ) : (
        <Button
          asChild
          onClick={toggle.onOpen}
          size={"sm"}
          className="items-center justify-center rounded-lg bg-atomic-tangerine-500 hover:bg-atomic-tangerine-600"
        >
          <Icon remixIconClass="ri-add-line" size="md" color="white" />
        </Button>
      )}
      <DialogContent
        size="large"
        className="top-[45%] mt-10 box-border border p-4"
      >
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
        <form onSubmit={product ? handleSubmit(onSubmitUpateProduct, onError) : handleSubmit(onSubmitCreateProduct, onError)}>
          <div className="max-h-[55vh] overflow-y-auto p-2">
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
            <FormField
              control={control}
              name="brand"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Marca</FormLabel>
                  <FormControl>
                    <Input
                      value={field.value}
                      onChange={field.onChange}
                      type="text"
                      placeholder="Marca del producto"
                      className="min-w-56 border"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex grow flex-row gap-2">
              <FormField
                control={control}
                name="CHILD_TAGS"
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
                name="CHILD_TAGS"
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
                      {getValues("CHILD_TAGS").length
                        ? getValues("CHILD_TAGS").map(
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
                            ),
                          )
                        : null}
                    </FormItem>
                  );
                }}
              />
            </div>
            <FormField
              control={control}
              name="VARIANTS"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Variantes</FormLabel>
                    <div className="mb-2 mt-2 flex flex-col gap-2">
                      {watch("VARIANTS") && watch("VARIANTS")?.length
                        ? watch("VARIANTS")?.map(
                            (
                              variant: Omit<variantsType, "id">,
                              index: number,
                            ) => (
                              <div className="flex flex-row gap-2" key={index}>
                                <Input
                                  key={index}
                                  type="text"
                                  placeholder="Nombre de variable"
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
                    {variantsCount < maxCountVariants ? (
                      <Button
                        size="sm"
                        className="w-full"
                        onClick={(e) => {
                          onAddVariant(e);
                        }}
                      >
                        Agregar variante
                      </Button>
                    ) : null}
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            {watch("PRODUCT_FILES") && watch("PRODUCT_FILES")?.length ? (
              <div className="mt-2 flex flex-row flex-wrap gap-2 rounded-lg">
                <Label>Imagenes ya registradas</Label>
                <div className="flex w-full flex-row items-start justify-start gap-4">
                  {watch("PRODUCT_FILES")?.map(
                    (productFile: ProductFilesType, index: number) => (
                      <div key={index} className="relative">
                        <div
                          onClick={() => onDeleteImage(index)}
                          className="absolute -right-2 -top-2 cursor-pointer rounded-full border bg-white px-1 opacity-70 transition-all ease-in-out hover:opacity-100"
                        >
                          <Icon
                            remixIconClass="ri-close-circle-fill"
                            color="red"
                            className="hover:text-red-900"
                          />
                        </div>
                        <div className="absolute -top-2 right-6 cursor-pointer rounded-full border bg-white px-1 opacity-70 transition-all ease-in-out hover:opacity-100">
                          <Icon
                            remixIconClass="ri-eye-fill"
                            color="blue"
                            className="hover:text-red-900"
                          />
                        </div>
                        <img
                          className="max-w-30 h-20 rounded-lg border shadow-xl"
                          alt="product img"
                          src={
                            process.env.NEXT_PUBLIC_SUPABASE_URL! +
                            process.env.NEXT_PUBLIC_SUPABASE_BUCKET_ROUTE! +
                            "/stores/" +
                            selectedStore?.id +
                            "/products/" +
                            productFile.PRODUCT_ID +
                            "/files/" +
                            productFile.file_name
                          }
                        />
                      </div>
                    ),
                  )}
                </div>
              </div>
            ) : null}

            <FormField
              control={control}
              name="images_files"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Imagenes</FormLabel>
                    <FormControl>
                      <Input
                        ref={inputUploadImage}
                        type="file"
                        onChange={onAddProductImage}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <div className="mt-2 flex flex-row flex-wrap gap-2 rounded-lg">
              {watch("images_files") && watch("images_files")?.length
                ? watch("images_files")?.map((image: File, index: number) => (
                    <div key={index} className="relative">
                      <div
                        onClick={() => onDeleteImage(index)}
                        className="absolute -right-2 -top-2 cursor-pointer rounded-full border bg-white px-1 opacity-70 transition-all ease-in-out hover:opacity-100"
                      >
                        <Icon
                          remixIconClass="ri-close-circle-fill"
                          color="red"
                          className="hover:text-red-900"
                        />
                      </div>
                      <div className="absolute -top-2 right-6 cursor-pointer rounded-full border bg-white px-1 opacity-70 transition-all ease-in-out hover:opacity-100">
                        <Icon
                          remixIconClass="ri-eye-fill"
                          color="blue"
                          className="hover:text-red-900"
                        />
                      </div>
                      <img
                        src={URL.createObjectURL(image)}
                        alt="product image"
                        className="max-w-30 h-20 rounded-lg border shadow-xl"
                      />
                    </div>
                  ))
                : null}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="hover:text-whte mt-2 flex gap-2 border-atomic-tangerine-100 bg-atomic-tangerine-500 text-xs hover:bg-atomic-tangerine-600 hover:shadow-md"
              disabled={loadingCreateProduct || loadingUpdateProduct}
            >
              {product ? "Editar producto" : "Crear producto"}
              {loadingCreateProduct || loadingUpdateProduct ? (
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
};

export default ProductsDialogBody;
