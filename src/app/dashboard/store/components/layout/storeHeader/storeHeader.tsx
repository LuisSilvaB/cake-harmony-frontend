"use client"
import cx from "@/utils/cx"
import StoreDialog from "../../ui/dialogs/storeDialog"
import { poppins } from "@/fonts"

const StoreHeader = () => {
  return (
    <div className={cx("flex items-center justify-between text-xl h-auto pb-2 font-medium", poppins.className)}> 
      <p>Tiendas</p>
      <StoreDialog />
    </div>
  )
}

export default StoreHeader