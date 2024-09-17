"use client"
import React, { useEffect } from 'react'
import ProductsStoreTable from '../../ui/productsStoreTable'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/redux/store'
import { getAllProductsByStoreId } from '@/app/dashboard/products/feature/product.feature'
import { FaSpinner } from 'react-icons/fa'
import { useParams } from 'next/navigation'

const ProductsStoreBody = () => {
  const { storeId } = useParams()
  const dispatch = useDispatch<AppDispatch>()
  const { products, loadingProducts } = useSelector((state: RootState) => state.products)
  const { selectedStore } = useSelector((state: RootState) => state.store)
  useEffect(() => {
    if (selectedStore?.id) {
      console.log(selectedStore)
      dispatch(
        getAllProductsByStoreId({ storeId: Number(storeId) ?? selectedStore.id }),
      );
    }
  }, [dispatch, selectedStore])

  if (loadingProducts)
    return (
      <div className="flex h-full w-full items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-white" />
      </div>
    );

  return (
    <div className='w-full flex flex-col overflow-auto'>
      <ProductsStoreTable products = {products} />
    </div>
  )
}

export default ProductsStoreBody