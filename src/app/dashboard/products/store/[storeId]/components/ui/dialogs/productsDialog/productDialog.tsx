import React from "react";
import ProductsDialogBody from "@/app/dashboard/products/store/[storeId]/components/ui/dialogs/productsDialog/productDialogBody/productDialogBody";
import { productsType } from "@/app/dashboard/products/store/[storeId]/types/products.type";
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
    id: "",
    name: "",
    description: "",
    brand:"", 
    image_url: [],
    images_files: [],
    MAIN_TAG: [], 
    CHILD_TAGS: [],
    VARIANTS: [],
  }

  const formMethods = useForm<ProductSchemaType>({
    defaultValues,
    resolver: zodResolver(ProductSchema),
    mode: "all",
  });
  return (
    <FormProvider {...formMethods}>
      <ProductsDialogBody tags={tags} loadingTags={loadingTags} product={product} />
    </FormProvider>
  );
};

export default ProductDialog;
