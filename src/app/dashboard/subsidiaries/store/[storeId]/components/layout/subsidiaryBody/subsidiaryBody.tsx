import { RootState } from '@/redux/store'
import React from 'react'
import { useSelector } from 'react-redux'
import SubsidiariesTable from '../../ui/tables'

const SubsidiaryBody = () => {
  const { subsidiaries } = useSelector((state: RootState) => state.subsidiary)
  return (
    <div className="flex w-full flex-col">
      <SubsidiariesTable subsidiaries={subsidiaries} />
    </div>
  );
}

export default SubsidiaryBody