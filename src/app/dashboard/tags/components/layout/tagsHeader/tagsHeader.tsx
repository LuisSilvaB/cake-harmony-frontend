import cx from '@/utils/cx'
import React from 'react'
import { poppins } from '@/fonts'

const TagsHeader = () => {
  return (
    <div
      className={cx(
        "flex h-auto items-center justify-between pb-2 text-xl font-medium",
        poppins.className,
      )}
    >
      <p>Categorías</p>
      {/* <SubsidiaryDialog /> */}
    </div>
  )
}

export default TagsHeader