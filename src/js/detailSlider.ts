import Swiper, { SwiperOptions, Navigation, EffectCreative } from "swiper";
import "swiper/css";
import { PAGE_ENTER } from "./constants/pageEnter";
import { PAGE_LEAVE } from "./constants/pageLeave";

export default function detailSlider() {
  let instances: Swiper[] = [];
  const SELECTOR = ".js-detail-slider";

  function initialize(context = document) {
    if (instances.length) return;
    const elements: HTMLElement[] = Array.from(
      context.querySelectorAll(SELECTOR)
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
            translate: ["-100%", 0, 0],
            scale: 0.6,
            origin: "right top",
          },
          next: {
            translate: ["100%", 0, 0],
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

    console.log("Initializing detail slider");
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
