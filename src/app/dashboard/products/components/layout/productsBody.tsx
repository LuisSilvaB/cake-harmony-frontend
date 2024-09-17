"use client"
import Icon from '@/components/ui/icon'
import { RootState } from '@/redux/store'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'

const ProductsBody = () => {
  const router = useRouter();
  const storesSelector = useSelector((state: RootState) => state.store);

  useEffect(() => {
    if (storesSelector.selectedStore) {
      router.push(`/dashboard/products/store/${storesSelector.selectedStore?.id}`);
    }
    
  }, [storesSelector.selectedStore, router]);

  return (
    <div className="flex w-full flex-col overflow-auto">
      <div className="flex flex-1 flex-col items-center justify-center">
        <Icon
          remixIconClass="ri-store-2-line"
          size="7xl"
          className="text-center font-extralight text-gray-600 opacity-25"
        />
        <p className="text-nowrap text-lg font-normal text-gray-600 opacity-25">
          Selecciona o crea una tienda
        </p>
      </div>
    </div>
  );
}

export default ProductsBody