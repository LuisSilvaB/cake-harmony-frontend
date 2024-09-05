'use client'
import React from 'react'
import StoreForm from '../../ui/storeForm/storeForm'
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Avatar } from '@/components/ui/avatar';
import { AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';

const PointOfSaleBody = () => {
  const storesSelector = useSelector((state: RootState) => state.store);
  return (
    <div className="flex h-full w-full flex-row items-center justify-center gap-24">
      <div className="flex flex-1 flex-col items-end justify-center gap-4">
        <div className="flex h-auto w-80 flex-col items-center justify-center rounded-lg border bg-white py-4 shadow-md">
          <p className="text-xl font-semibold text-atomic-tangerine-500">
            Crea una nueva tienda
          </p>
          <p className="mx-10 py-2 text-center text-xs font-normal">
            Si no tienes una tienda, crea una nueva para comenzar a vender
          </p>
          <StoreForm />
        </div>
      </div>
      <div className='flex-1'>
        <div className="flex h-full max-h-[340px] w-fit flex-1 flex-col items-start justify-center gap-4 overflow-y-auto px-4 pb-4 pt-20">
          {Array.isArray(storesSelector.stores) && storesSelector.stores.length
            ? storesSelector.stores.map((store, index) => (
                <div
                  key={index}
                  className="flex w-80 cursor-pointer flex-row items-center justify-start gap-2 rounded-lg border bg-white p-4 shadow-md transition-all duration-300 ease-in-out hover:shadow-lg"
                >
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>Log</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start justify-center gap-2">
                    <p className="text-xl font-semibold text-atomic-tangerine-500">
                      {store.name}
                    </p>
                    <p className="text-center text-xs font-normal">
                      {store.description}
                    </p>
                  </div>
                </div>
              ))
            : null}
        </div>
      </div>
    </div>
  );
}

export default PointOfSaleBody