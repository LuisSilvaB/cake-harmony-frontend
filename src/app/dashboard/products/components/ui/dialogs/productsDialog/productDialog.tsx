import React from "react";
import ProductsDialogBody from "@/app/dashboard/products/components/ui/dialogs/productsDialog/productDialogBody/productDialogBody";
import { productsType } from "@/app/dashboard/globalProducts/types/globalProducts.type";
import { ProductSchema, ProductSchemaType } from "@/app/dashboard/products/schema/product.schema";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface ProductDialogProps {
  product?: productsType;
}

const ProductDialog = ({ product }: ProductDialogProps) => {
  const defaultValues: ProductSchemaType = {
    id: 0,
    name: "",
    description: "",
    image_url: [],
    PRODUCTS_TAG: [],
    PRODUCT_VARIANTS: [],
  }

  const formMethods = useForm<ProductSchemaType>({
    defaultValues,
    resolver: zodResolver(ProductSchema),
    mode: "all",
    reValidateMode: "onSubmit", 
  });
  return (
    <FormProvider {...formMethods}>
      <ProductsDialogBody product={product} />
    </FormProvider>
  );
};

export default ProductDialog;
