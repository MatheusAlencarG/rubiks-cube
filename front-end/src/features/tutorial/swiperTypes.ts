export interface SwiperParams {
  breakpoints?: Record<number, { slidesPerView: number }>;
  breakpointsBase: 'container';
  effect: 'slide';
  grabCursor: boolean;
  centeredSlides: boolean;
  slidesPerView: number | 'auto' | undefined;
  spaceBetween: number;
  activeSlideKey: string;
}
