"use client"
import React, { lazy } from 'react'
import ProductsLayout from './layout';
import ProductsHeader from './components/layout/productsHeader/productsHeader';

const ProductsPage = () => {
  const ProductsBody = lazy(() => import('./components/layout/productsBody'));

  return (
    <ProductsLayout>
      <ProductsHeader />
      <ProductsBody />
    </ProductsLayout>
  );
}

export default ProductsPage