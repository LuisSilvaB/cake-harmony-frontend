import Icon from '@/components/ui/icon';
import React from 'react'

const Body = () => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <Icon
        remixIconClass="ri-store-2-line"
        size="7xl"
        className="text-center font-extralight text-gray-600 opacity-25"
      />
      <p className="text-nowrap text-xl font-normal text-gray-600 opacity-25">
        Selecciona o crea una tienda
      </p>
    </div>
  );
}

export default Body