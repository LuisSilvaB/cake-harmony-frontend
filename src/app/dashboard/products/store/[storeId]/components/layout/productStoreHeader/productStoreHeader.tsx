import { Button, Input } from '@/components/ui'
import Icon from '@/components/ui/icon'
import React from 'react'

const ProductStoreHeader = () => {
  return (
    <div className='w-full flex justify-between items-center py-0 h-10'>
      <div className='flex items-center gap-2 relative'>
        <Input placeholder='Buscar por producto' className='w-full text-xs' />
        <Icon remixIconClass='ri-search-line' size='sm' className='absolute right-2 top-1/2 -translate-y-1/2' color='gray' />
      </div>
      <Button variant="secondary" size="xs" className='' >
        <Icon remixIconClass='ri-add-line' size='sm' />
      </Button>
    </div>
  )
}

export default ProductStoreHeader