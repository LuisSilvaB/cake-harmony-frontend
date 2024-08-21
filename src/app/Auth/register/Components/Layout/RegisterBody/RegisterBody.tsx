import React from 'react'
import RegisterBodyForm from './RegisterBodyForm';
import MilisLogo  from '/public/img/milis-caskes.jpg';

const RegisterBody = () => {
  return (
    <div className='flex-1 w-full bg-white flex flex-row gap-4 p-2'>
      <RegisterBodyForm />
      <div className='flex-1'>
        <img src={MilisLogo.src} alt="CakeHarmonyLogo" className='w-full h-full rounded-lg' />
      </div> 
    </div>
  )
}

export default RegisterBody