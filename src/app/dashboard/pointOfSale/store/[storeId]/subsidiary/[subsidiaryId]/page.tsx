'use client'
import { RootState } from '@/redux/store';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';

const Subsidiary = () => {
  const router = useRouter();
  const subsidiariesSelector = useSelector((state: RootState) => state.subsidiary);
  const storesSelector = useSelector((state: RootState) => state.store);
  useEffect(() => {
    const selectedStore = storesSelector.selectedStore?.id;
    const selectedSubsidiary = subsidiariesSelector.selectedSubsidiary?.id;
  
    if (selectedStore && selectedSubsidiary) {
      router.push(`/dashboard/pointOfSale/store/${selectedStore}/subsidiary/${selectedSubsidiary}`);
    } else if (selectedStore && !selectedSubsidiary) {
      router.push(`/dashboard/pointOfSale/store/${selectedStore}`);
    }
  }, [storesSelector.selectedStore, subsidiariesSelector.selectedSubsidiary, router]);

  return (
    <div>Subsidiary</div>
  )
}

export default Subsidiary