"use client"
import React, { lazy, useEffect } from 'react'
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useRouter } from 'next/navigation';
import Layout from './layout';

const ProductsPage = () => {
  const router = useRouter();
  const storesSelector = useSelector((state: RootState) => state.store);

  useEffect(() => {
    if (storesSelector.selectedStore?.id) {
      router.push(`/dashboard/products/store/${storesSelector.selectedStore?.id}`);
    }
    
  }, [storesSelector.selectedStore, router]);

  const Body = lazy(() => import('./components/layout/body/body'));

  return (
    <Layout>
      <Body />
    </Layout>
  );
}

export default ProductsPage