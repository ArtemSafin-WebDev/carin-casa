import Swiper, { SwiperOptions, Navigation, EffectCreative } from "swiper";
import "swiper/css";

export default function detailSlider() {
  const SELECTOR = ".js-detail-slider";
  const elements: HTMLElement[] = Array.from(
    document.querySelectorAll(SELECTOR)
  );

  elements.forEach((element) => {
    const container = element.querySelector<HTMLDivElement>(".swiper");
    const prev = element.querySelector<HTMLButtonElement>(
      ".detail__slider-arrow--prev"
    );
    const next = element.querySelector<HTMLButtonElement>(
      ".detail__slider-arrow--next"
    );

    let options: SwiperOptions = {
      modules: [Navigation, EffectCreative],
      slidesPerView: 1,
      speed: 800,
      loop: true,
      loopedSlides: 2,
      centeredSlides: true,
      longSwipesRatio: 0.2,
      effect: "creative",
      creativeEffect: {
        limitProgress: 2,
        prev: {
          translate: ["-100.5%", 0, 0],
          scale: 0.6,
          origin: "right top",
        },
        next: {
          translate: ["100.5%", 0, 0],
          scale: 0.6,
          origin: "left top",
        },
      },
    };

    if (prev && next) {
      options = {
        ...options,
        navigation: {
          nextEl: next,
          prevEl: prev,
        },
      };
    }

    if (container) {
      new Swiper(container, options);
    }
  });
}
