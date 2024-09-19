import React, { useEffect } from 'react'
import GlobalProductsTable from '../../ui/productsTable'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/redux/store'
import { FaSpinner } from 'react-icons/fa'
import { getAllProducts } from '../../../feature/products.feature'

const ProductsBody = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { products, loadingProducts } = useSelector((state: RootState) => state.products)

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
    <div className='w-full flex flex-col overflow-auto'>
      <GlobalProductsTable globalProducts={products} />
    </div>
  )
}

export default ProductsBody