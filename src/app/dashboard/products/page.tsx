"use client"
import React, { useEffect } from 'react'
import Layout from './layout';
import { lazy } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

// Cargar el componente de forma diferida
const Body = lazy(() => import('./components/layout/body'));

const SubsidiariesPage = () => {
  const router = useRouter();
  const storesSelector = useSelector((state: RootState) => state.store);

  useEffect(() => {
    if (storesSelector.selectedStore?.id) {
      router.push(`/dashboard/products/store/${storesSelector.selectedStore?.id}`);
    }
    
  }, [storesSelector.selectedStore, router]);


  return (
    <Layout>
      <Body />
    </Layout>
  )
}

export default SubsidiariesPage