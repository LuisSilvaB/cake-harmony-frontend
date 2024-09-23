"use client"
import React from 'react'
import cx from "@/utils/cx"
import { poppins } from "@/fonts"
import SubsidiaryDialog from '../../ui/dialogs/subsidiaryDialog'

const SubsidiaryHeader = () => {
  return (
    <div
      className={cx(
        "flex h-auto items-center justify-between pb-2 text-xl font-medium",
        poppins.className,
      )}
    >
      <p>Sucursales</p>
      <SubsidiaryDialog />
    </div>
  );
}

export default SubsidiaryHeader