'use client'
import React from 'react'
import { StoreTable } from '../../ui/tables'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
const StoreBody = () => {
  const stores = useSelector((state: RootState) => state.store.stores)

  return (
    <div className='flex w-full flex-col'>
      <StoreTable stores={stores} />
    </div>
  )
}

export default StoreBody