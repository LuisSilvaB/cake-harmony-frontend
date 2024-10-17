import ProductDialog from '@/app/dashboard/products/store/[storeId]/components/ui/dialogs/productsDialog'
import { poppins } from '@/fonts'
import { AppDispatch, RootState } from '@/redux/store'
import cx from '@/utils/cx'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getTags } from '../../../../../../tags/feature/tags.feature'
import { getAllProductsByStoreIdFeature } from '../../../feature/products.feature'

const ProductsHeader = () => {
  const dispatch = useDispatch<AppDispatch>() 
  const { tags, loading:loadingTags } = useSelector((state: RootState) => state.tags) 
  const { selectedStore } = useSelector((state: RootState) => state.store)
  
  useEffect(()=>{
    const fetchData = async () => {
      await dispatch(getAllProductsByStoreIdFeature({ storeId: selectedStore?.id ?? 0 }))
      await dispatch(getTags())
    }

    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[dispatch])
  return (
    <div
      className={cx(
        "flex h-auto items-center justify-between pb-2 text-xl font-medium",
        poppins.className,
      )}
    >
      <p>Productos</p>
      <ProductDialog tags={tags} loadingTags={loadingTags} />
    </div>
  )
}

export default ProductsHeader