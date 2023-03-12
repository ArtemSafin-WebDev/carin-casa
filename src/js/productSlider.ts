import Swiper, { SwiperOptions, Navigation, EffectCreative } from "swiper";
import "swiper/css";
import { PAGE_ENTER } from "./constants/pageEnter";
import { PAGE_LEAVE } from "./constants/pageLeave";

export default function productSlider() {
  let instances: Swiper[] = [];
  const SELECTOR = ".js-product-slider";

  function initialize(context = document) {
    if (instances.length) return;
    const elements: HTMLElement[] = Array.from(
      context.querySelectorAll(SELECTOR)
    );

    elements.forEach((element) => {
      const container = element.querySelector<HTMLDivElement>(".swiper");
      const prev = element.querySelector<HTMLButtonElement>(
        ".product__slider-arrow--prev"
      );
      const next = element.querySelector<HTMLButtonElement>(
        ".product__slider-arrow--next"
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
        const instance = new Swiper(container, options);

        instances.push(instance);
      }
    });
  }

  function destroy() {
    instances.forEach((instance) => instance.destroy());
    instances = [];
  }

  document.addEventListener(PAGE_LEAVE, () => {
    destroy();
  });

  document.addEventListener(PAGE_ENTER, (event: CustomEvent) => {
    initialize(event.detail.container);
  });
}
