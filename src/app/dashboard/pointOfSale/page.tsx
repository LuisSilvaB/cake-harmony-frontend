"use client"
import React, { useEffect } from 'react'
import { useParams } from 'next/navigation';
import { gabarito } from '@/fonts';
import cx from '@/libs/cx';
import PosBody from './components/layout/pointOfSaleBody/pointOfSaleBody';
import { setSelectedStore } from '@/app/dashboard/store/feature/store.feature';
import { setSelectedSubsidiary } from '@/app/dashboard/subsidiary/feature/subsidiary.feature';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';

const PointOfSale = () => {
  const params = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const storesSelector = useSelector((state: RootState) => state.store);
  const subsidiariesSelector = useSelector((state: RootState) => state.subsidiary);
  useEffect(() => {
      dispatch(setSelectedStore(null));
      dispatch(setSelectedSubsidiary(null));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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