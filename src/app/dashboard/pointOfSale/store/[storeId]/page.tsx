import Icon from '@/components/ui/icon'
import React from 'react'
import StoreBody from '../components/storeBody/storeBody'
import cx from '@/libs/cx';
import { gabarito } from '@/fonts';

const PointOfSaleStore = () => {
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