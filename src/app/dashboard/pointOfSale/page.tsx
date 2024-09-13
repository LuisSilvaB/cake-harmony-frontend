"use client"
import React, { useEffect } from 'react'
import { gabarito } from '@/fonts';
import cx from '@/libs/cx';
import PosBody from './components/layout/pointOfSaleBody/pointOfSaleBody';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useRouter } from 'next/navigation';

const PointOfSale = () => {
  const router = useRouter();
  const storesSelector = useSelector((state: RootState) => state.store);

  useEffect(() => {
    if (storesSelector.selectedStore) {
      router.push(`/dashboard/pointOfSale/store/${storesSelector.selectedStore?.id}`);
    }
    
  }, [storesSelector.selectedStore, router]);


  return (
      <div
        className={cx(
          "box-border flex w-full flex-1 flex-row items-center justify-center rounded-lg bg-white",
          gabarito.className,
        )}
      >
        <PosBody />
      </div>
  );
}

export default PointOfSale