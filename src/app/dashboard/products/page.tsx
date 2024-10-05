"use client"
import React, { lazy } from 'react'
import ProductsLayout from './layout';
import ProductsHeader from '../tags/components/layout/tagsHeader/productsHeader';

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