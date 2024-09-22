import React, { lazy } from 'react'
import StoreLayout from './layout'

const StoreHeader = lazy(() => import('./components/layout/storeHeader'))
const StoreBody = lazy(() => import('./components/layout/storeBody'))

const StorePage = () => {
  return (
    <StoreLayout>
      <StoreHeader />
      <StoreBody />
    </StoreLayout>
  );
}

export default StorePage