import React from 'react'
import { StoreTable } from '../../ui/tables'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/redux/store'
const StoreBody = () => {
  const dispatch = useDispatch<AppDispatch>() 
  const user = useSelector((state: RootState) => state.user.user)
  console.log(user)
  return (
    <div className='flex w-full flex-col'>

      <StoreTable />
    </div>
  )
}

export default StoreBody