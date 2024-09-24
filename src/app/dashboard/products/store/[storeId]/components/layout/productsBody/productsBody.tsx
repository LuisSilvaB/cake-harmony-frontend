'use client'
import React, { useEffect } from 'react'
import ProductTable from '../../ui/productsTable'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/redux/store'
import { FaSpinner } from 'react-icons/fa'
import { getAllProducts, getProductBySubsidiaryId } from '../../../feature/products.feature'
import { Button } from '@/components/ui'
import { Badge } from '@/components/ui/badge'

const ProductsBody = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { products, loadingProducts } = useSelector((state: RootState) => state.products)
  const { selectedProduct } = useSelector((state: RootState) => state.products)
  const selectedStore = useSelector((state: RootState) => state.store.selectedStore)

  useEffect(() => {
    dispatch(getAllProducts())
  }, [dispatch])

  if (loadingProducts)
    return (
      <div className="flex h-full w-full items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-white" />
      </div>
    );

  return (
    <div className="flex w-full flex-col overflow-auto">
      <div className="flex w-full items-center justify-between p-2">
        <div className='flex flex-col gap-1 justify-start'>
          <p className="text-2xl font-bold">{selectedStore?.name}</p>
          <Badge className='w-fit'>Mis productos</Badge>
        </div>
        <Button
          className="rounded-md bg-atomic-tangerine-600 px-4 py-2 text-white hover:bg-atomic-tangerine-700"
          size={"sm"}
        >
          Agregar producto
        </Button>
      </div>
      <ProductTable globalProducts={products} />
    </div>
  );
}

export default ProductsBody