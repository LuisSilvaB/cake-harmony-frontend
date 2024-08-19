import React from 'react'
import RegisterBodyForm from './RegisterBodyForm';

const RegisterBody = () => {
  return (
    <div className='flex-1 w-full bg-white flex flex-row gap-4 p-4'>
      <RegisterBodyForm />
      <div className='flex-1'></div> 
    </div>
  )
}

export default RegisterBody