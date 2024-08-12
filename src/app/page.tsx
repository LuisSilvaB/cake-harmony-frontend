import React from 'react'
import HomeHeader from './home/components/Layout/HomeHeader';
import HomeBody from './home/components/Layout/HomeBody';
const Home = () => {
  return (
    <div className="w-full flex flex-1 flex-col items-center">
      <HomeHeader />
      <HomeBody />
    </div>
  );
}

export default Home