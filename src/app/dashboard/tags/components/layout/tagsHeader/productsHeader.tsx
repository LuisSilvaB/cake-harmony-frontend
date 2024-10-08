import ProductDialog from '@/app/dashboard/products/components/ui/dialogs/productsDialog'
import { poppins } from '@/fonts'
import { AppDispatch, RootState } from '@/redux/store'
import cx from '@/utils/cx'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getTags } from '../../../feature/tags.feature'

const ProductsHeader = () => {
  const dispatch = useDispatch<AppDispatch>() 
  const { tags, loading:loadingTags } = useSelector((state: RootState) => state.tags) 
  useEffect(()=>{
    dispatch(getTags())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])
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