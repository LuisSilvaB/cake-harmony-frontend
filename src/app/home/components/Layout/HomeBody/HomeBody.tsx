'use client'
import React from 'react'
import cx from '@/libs/cx'
import HomeBenefitsCard from '../../ui/HomeBenefitsCard';
import { poppins } from '@/fonts'
import { Button } from '@/components/ui'
import { HomeBenefits } from '@/app/home/assets/mock';

import Autoplay from 'embla-carousel-autoplay'
import {
  Carousel,
  CarouselContent, 
  CarouselItem,
} from "@/components/ui/carousel";


const HomeBody = () => {
  const plugin = React.useRef(
    Autoplay({ delay: 4000, breakpoints: {
      640: { delay: 2000 },
      768: { delay: 3000 },
      1024: { delay: 4000 },
    } })
  )

  return (
    <div className="flex w-full flex-1 flex-col items-center bg-white">
      {/** Home section */}
      <section className="flex h-full max-h-[1080px] min-h-[450px] w-full max-w-screen-xl flex-col justify-center gap-2 px-2 sm:px-6 lg:px-9">
        <p
          className={cx(
            "text-3xl text-atomic-tangerine-300 lg:text-6xl",
            poppins.className,
          )}
        >
          Incrementa el rendimiento
        </p>
        <p className="text-2xl font-extrabold text-amber-900 lg:text-4xl">
          De tu pastelería
        </p>
        <p className="max-w-2xl text-sm font-normal">
          Descubre cómo nuestra aplicación puede transformar tu negocio,
          optimizando procesos y mejorando la eficiencia. ¡Lleva tu pastelería
          al siguiente nivel con nuestras herramientas innovadoras!
        </p>
        <Button className="mt-4 w-fit"> Comienza ya!</Button>
      </section>

      {/*** Benefits section */}
      <section className="flex h-full min-h-[calc(20vh)] w-full flex-col items-center gap-2">
        <section className="flex h-full w-full flex-row justify-center gap-2 overflow-y-auto px-2 sm:px-6 lg:justify-start lg:px-9 xl:max-w-screen-xl xl:justify-between">
          <Carousel
            opts={{
              breakpoints:{
                640: { loop: true },
                1024: { loop: false, dragFree: true },
              }
            }}
            orientation="horizontal"
            plugins={[plugin.current]}
            className="w-full"
            // onMouseEnter={plugin.current.stop}
            // onMouseLeave={plugin.current.reset}
          >
            <CarouselContent className="flex w-full gap-1 px-1">
              {HomeBenefits.map((item, index) => (
                <CarouselItem
                  key={index}
                  className="w-fit basis-[95%] sm:basis-[45%] lg:basis-[25%]"
                >
                  <HomeBenefitsCard {...item} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </section>
      </section>
    </div>
  );
}

export default HomeBody