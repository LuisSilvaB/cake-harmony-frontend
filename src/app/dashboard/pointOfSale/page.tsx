"use client"
import React from 'react'
import { useParams } from 'next/navigation';
import { gabarito } from '@/fonts';
import cx from '@/libs/cx';
import PosBody from './components/layout/pointOfSaleBody/pointOfSaleBody';


const PointOfSale = () => {
  const params = useParams();
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