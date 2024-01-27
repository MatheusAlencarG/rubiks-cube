export interface SwiperParams {
  effect: "coverflow" | "slide" | "fade" | "cube" | "flip" | "creative" | "cards" | undefined;
  grabCursor: boolean;
  centeredSlides: boolean;
  slidesPerView: number | "auto" | undefined;
  coverflowEffect: {
    rotate: number;
    stretch: number;
    depth: number;
    modifier: number;
    slideShadows: boolean
  },
  activeSlideKey: string;
}