import React from 'react';
import Swiper from 'react-id-swiper';
import 'swiper/swiper.css';
import type { SwiperParams } from './swiperTypes';

const params: SwiperParams = {
  effect: 'slide',
  grabCursor: true,
  centeredSlides: true,
  slidesPerView: 1,
  spaceBetween: 16,
  activeSlideKey: '0',
  breakpointsBase: 'container',
  breakpoints: { 520: { slidesPerView: 2 }, 660: { slidesPerView: 3 } },
};

interface TutorialCarouselProps {
  children: React.ReactElement[];
}

export default function TutorialCarousel({ children }: TutorialCarouselProps) {
  const firstSlideKey = String(children[0]?.key ?? '0');

  return (
    <div className="rounded-2xl border border-solid border-detail bg-canvas p-3 sm:p-4">
      <Swiper
        {...params}
        activeSlideKey={firstSlideKey}
        containerClass="swiper-container w-full overflow-hidden [&_.swiper-slide]:flex [&_.swiper-slide]:h-auto [&_.swiper-wrapper]:h-auto"
      >
        {children}
      </Swiper>
    </div>
  );
}
