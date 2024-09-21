import React, { lazy } from 'react'
import StoreLayout from './layout'

const StoreBody = lazy(() => import('./components/layout/storeBody'))

const StorePage = () => {
  return (
    <StoreLayout>
      <StoreBody />
    </StoreLayout>
  );
}

export default StorePage