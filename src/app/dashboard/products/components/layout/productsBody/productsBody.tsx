'use client'
import React from 'react'
import Icon from '@/components/ui/icon';

const ProductsBody = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <Icon remixIconClass='ri-store-2-line' size='7xl'  className='opacity-25 text-gray-600 font-extralight text-center' />
      <p className='text-xl text-gray-600 text-nowrap font-normal opacity-25'>Selecciona o crea una tienda</p>
    </div>
  );
}

export default ProductsBody