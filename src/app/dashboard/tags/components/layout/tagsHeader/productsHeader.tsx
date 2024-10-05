import ProductDialog from '@/app/dashboard/products/components/ui/dialogs/productsDialog'
import { poppins } from '@/fonts'
import cx from '@/utils/cx'
import React from 'react'

const ProductsHeader = () => {
  return (
    <div
      className={cx(
        "flex h-auto items-center justify-between pb-2 text-xl font-medium",
        poppins.className,
      )}
    >
      <p>Productos</p>
      <ProductDialog  />
    </div>
  )
}

export default ProductsHeader