import React, { useEffect } from 'react'
import GlobalProductsTable from '../../ui/globalProductsTable'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/redux/store'
import { FaSpinner } from 'react-icons/fa'
import { getAllGlobalProducts } from '../../../feature/global-products.feature'

const GlobalProductsBody = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { globalProducts, loadingGlobalProducts } = useSelector((state: RootState) => state.globalProducts)

  useEffect(() => {
    dispatch(getAllGlobalProducts())
  }, [dispatch])

  if (loadingGlobalProducts)
    return (
      <div className="flex h-full w-full items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-white" />
      </div>
    );

  return (
    <div className='w-full flex flex-col overflow-auto'>
      <GlobalProductsTable globalProducts={globalProducts} />
    </div>
  )
}

export default GlobalProductsBody