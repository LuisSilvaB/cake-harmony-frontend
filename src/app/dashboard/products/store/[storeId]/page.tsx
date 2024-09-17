import React, { lazy } from 'react'
import ProductsStoreLayout from './layout';

const ProductsStorePage = () => {

  const ProductsStoreBody = lazy(() => import('./components/layout/productsStoreBody'));
  const ProductStoreHeader = lazy(() => import('./components/layout/productStoreHeader'));
  return (
    <ProductsStoreLayout>
      <ProductStoreHeader />
      <ProductsStoreBody />
    </ProductsStoreLayout>
  );
}

export default ProductsStorePage