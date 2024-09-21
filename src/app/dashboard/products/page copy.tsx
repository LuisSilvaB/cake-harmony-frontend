"use client"
import React, { lazy } from 'react'
import ProductsLayout from './layout';

const ProductsPage = () => {
  const ProductsBody = lazy(() => import('./components/layout/productsBody'));

  return (
    <ProductsLayout>
      <ProductsBody />
    </ProductsLayout>
  );
}

export default ProductsPage