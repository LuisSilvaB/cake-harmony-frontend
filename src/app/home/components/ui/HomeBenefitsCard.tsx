import React from 'react'
import { HomeBenefitsType } from '@/app/home/types'

const HomeBenefitsCard: React.FC<HomeBenefitsType> = ({ id, title, description, icon }) => {
  return (
    <div className="flex min-w-60 max-w-[290px] min-h-32 items-center justify-center gap-2 rounded-lg bg-white p-4 shadow-lg border h-fit"> 
      <div className="rounded-lg bg-atomic-tangerine-50 p-2 text-2xl font-bold text-atomic-tangerine-300">
        {icon}
      </div>
      <div>
        <h3 className="rounded-lg p-2 pb-0 text-base font-bold text-atomic-tangerine-300">
          {title}
        </h3>
        <p className="rounded-lg p-2 pt-0 text-xs lg:text-[10px] font-normal text-gray-500">
          {description}
        </p>
      </div>
    </div>
  );
}

export default HomeBenefitsCard