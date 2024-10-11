import React from "react";
import ProductsDialogBody from "@/app/dashboard/products/store/[storeId]/components/ui/dialogs/productsDialog/productDialogBody/productDialogBody";
import { productsType } from "@/app/dashboard/globalProducts/types/globalProducts.type";
import { ProductSchema, ProductSchemaType } from "@/app/dashboard/products/store/[storeId]/schema/product.schema";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TagsType } from "@/app/dashboard/tags/types/tags.type";

interface ProductDialogProps {
  product?: productsType;
  tags?:TagsType[]; 
  loadingTags?:boolean;
}

const ProductDialog = ({ product, tags = [], loadingTags = false }: ProductDialogProps) => {
  const defaultValues: ProductSchemaType = {
    id: 0,
    name: "",
    description: "",
    image_url: [],
    images_files: [],
    MAIN_TAG: [], 
    TAGS: [],
    VARIANTS: [],
  }

  const formMethods = useForm<ProductSchemaType>({
    defaultValues,
    resolver: zodResolver(ProductSchema),
    mode: "all",
    reValidateMode: "onSubmit", 
  });
  return (
    <FormProvider {...formMethods}>
      <ProductsDialogBody tags={tags} loadingTags={loadingTags} product={product} />
    </FormProvider>
  );
};

export default ProductDialog;
