"use client"
import React, { lazy } from 'react'
import GlobalProductsLayout from './layout';

const GlobalProductsPage = () => {
  const GlobalProductsBody = lazy(() => import('./components/layout/globalProductsBody'));

  return (
    <GlobalProductsLayout>
      <GlobalProductsBody />
    </GlobalProductsLayout>
  );
}

export default GlobalProductsPage