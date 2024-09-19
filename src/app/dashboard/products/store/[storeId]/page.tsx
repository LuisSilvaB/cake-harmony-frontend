'use client'
import React, { useEffect } from 'react'
import StoreBody from '../components/storeBody/storeBody'
import cx from '@/utils/cx';
import { gabarito } from '@/fonts';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useParams, useRouter } from 'next/navigation';

const PointOfSaleStore = () => {
  const router = useRouter();
  const subsidiariesSelector = useSelector((state: RootState) => state.subsidiary);
  const storesSelector = useSelector((state: RootState) => state.store);
  useEffect(() => {
    const selectedStore = storesSelector.selectedStore?.id;
    const selectedSubsidiary = subsidiariesSelector.selectedSubsidiary?.id;
  
    if (selectedStore && selectedSubsidiary) {
      router.push(`/dashboard/products/store/${selectedStore}/subsidiary/${selectedSubsidiary}`);
    } else if (selectedStore) {
      router.push(`/dashboard/products/store/${selectedStore}`);
    }
  }, [storesSelector.selectedStore, subsidiariesSelector.selectedSubsidiary, router]);
  


  return (
    <div
      className={cx(
        "box-border flex w-full flex-1 flex-row items-center justify-center rounded-lg bg-white",
        gabarito.className,
      )}
    >
      
      <StoreBody />
    </div>
  );
}

export default PointOfSaleStore