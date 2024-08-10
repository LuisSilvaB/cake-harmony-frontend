'use client'
import React from 'react'

const Navbar = () => {
  return (
    <nav className="flex h-10 w-full flex-col items-center justify-center bg-white shadow-md">
      <div className="flex h-full w-full max-w-screen-2xl items-center border px-2 sm:px-6 lg:px-8">
        <section className='min-w-28'>
          <p>Cake Harmony</p>
        </section>
        <section className="flex h-full w-full items-center justify-between">
          <div className="flex h-full w-full items-center justify-between"></div>
        </section>
      </div>
    </nav>
  );
}

export default Navbar