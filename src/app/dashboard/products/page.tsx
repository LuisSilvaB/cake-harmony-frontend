"use client"
import React, { lazy, useEffect } from 'react'
import { gabarito } from '@/fonts';
import cx from '@/utils/cx';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useRouter } from 'next/navigation';
import ProductsLayout from './layout';
import ProductsBody from './components/layout/productsBody/productsBody';

const ProductsPage = () => {
  const router = useRouter();
  const storesSelector = useSelector((state: RootState) => state.store);

  useEffect(() => {
    if (storesSelector.selectedStore) {
      router.push(`/dashboard/products/store/${storesSelector.selectedStore?.id}`);
    }
    
  }, [storesSelector.selectedStore, router]);


  return (
    <ProductsLayout>
      <div
        className={cx(
          "box-border flex w-full flex-1 flex-row items-center justify-center rounded-lg bg-white",
          gabarito.className,
        )}
      >
        <ProductsBody />
      </div>
    </ProductsLayout>
  );
}

export default ProductsPage