import { ProductSchema } from '@/app/dashboard/products/schema/product.schema';
import { ProductType } from '@/app/dashboard/products/types/product.type';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form';

const ProductStoreDialog = () => {
  const defaultValues = {
    name: "",
    price: 0, 
    description: "",
    imageUrl: [],
    storeId: 0,
  }

  const formMetods = useForm<Omit<ProductType, "id" | "created_at">>({
    resolver: zodResolver(ProductSchema),
    defaultValues,
    mode: "all",
    reValidateMode: "onSubmit",
  });

  return (
    <FormProvider {...formMetods}>
      <div>ProductStoreDialog</div>
    </FormProvider>
  )
}

export default ProductStoreDialog