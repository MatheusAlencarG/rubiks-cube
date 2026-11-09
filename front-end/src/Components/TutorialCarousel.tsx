import React from 'react';
import Swiper from 'react-id-swiper';
import 'swiper/swiper.css';
import type { SwiperParams } from '../types/SwiperTypes';

const params: SwiperParams = {
  effect: 'coverflow',
  grabCursor: true,
  centeredSlides: true,
  slidesPerView: 3,
  coverflowEffect: { rotate: 50, stretch: 0, depth: 100, modifier: 1, slideShadows: true },
  activeSlideKey: '0',
  breakpoints: { 0: { slidesPerView: 1 }, 601: { slidesPerView: 2 }, 901: { slidesPerView: 3 } },
};

interface TutorialCarouselProps {
  children: React.ReactElement[];
  className?: string;
}

export default function TutorialCarousel({ children, className = '' }: TutorialCarouselProps) {
  const firstSlideKey = String(children[0]?.key ?? '0');

  return (
    <Swiper
      {...params}
      activeSlideKey={firstSlideKey}
      containerClass={`swiper-container [&_.swiper-wrapper]:flex [&_.swiper-wrapper]:items-center ${className}`}
    >
      {children}
    </Swiper>
  );
}
