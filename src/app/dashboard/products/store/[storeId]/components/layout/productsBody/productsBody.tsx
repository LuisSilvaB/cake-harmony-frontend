'use client'
import React, { useEffect } from 'react'
import ProductTable from '../../ui/productsTable'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/redux/store'
import { FaSpinner } from 'react-icons/fa'

const ProductsBody = () => {
  const { products, loadingProducts } = useSelector((state: RootState) => state.products)
  const { selectedStore } = useSelector((state: RootState) => state.store)
  if (loadingProducts)
    return (
      <div className="flex h-full w-full items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-white" />
      </div>
    );

  return (
    <div className="flex w-full flex-col overflow-auto">
      <ProductTable products={products} selectedStore={selectedStore} />
    </div>
  );
}

export default ProductsBody