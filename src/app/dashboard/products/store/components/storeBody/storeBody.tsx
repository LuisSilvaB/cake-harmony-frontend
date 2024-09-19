'use client'
import React from 'react'
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import Icon from '@/components/ui/icon';

const StoreBody = () => {
  const storesSelector = useSelector((state: RootState) => state.store);
  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <Icon remixIconClass='ri-git-merge-fill' size='9xl'  className='opacity-25 text-gray-600 font-extralight text-center' />
      <p className='text-normal text-gray-600 text-nowrap font-normal opacity-25'>Selecciona o crea una sucursal</p>
    </div>
  );
}

export default StoreBody