import Swiper, { SwiperOptions, Autoplay, EffectFade } from "swiper";
import "swiper/css";
import { PAGE_ENTER } from "./constants/pageEnter";
import { PAGE_LEAVE } from "./constants/pageLeave";

export default function introMobileSlider() {
  let instances = [];

  function initialize(context = document) {
    if (instances.length) return;
    const elements: HTMLElement[] = Array.from(
      context.querySelectorAll(".js-intro-mobile-slider")
    );

    elements.forEach((element) => {
      const container: HTMLElement | null = element.querySelector(".swiper");
      if (!container) return;
      let sliderInstance: Swiper | null = null;
      const options: SwiperOptions = {
        modules: [Autoplay, EffectFade],
        slidesPerView: "auto",
        speed: 1500,
        effect: "fade",
        fadeEffect: {
          crossFade: false,
        },
        autoplay: {
          delay: 1500,
          disableOnInteraction: false,
        },
        allowTouchMove: false,
      };

      const mql = window.matchMedia("(max-width: 640px)");

      const handleWidthChange = (e: MediaQueryListEvent | MediaQueryList) => {
        if (e.matches) {
          sliderInstance = new Swiper(container, options);
        } else {
          if (sliderInstance) {
            sliderInstance.destroy();
            sliderInstance = null;
          }
        }
      };

      mql.addEventListener("change", handleWidthChange);

      handleWidthChange(mql);

      instances.push({
        mql,
        handleWidthChange,
        sliderInstance,
      });
    });
  }

  function destroy() {
    instances.forEach((instance) => {
      const { mql, handleWidthChange, sliderInstance } = instance;

      mql.removeEventListener("change", handleWidthChange);

      if (sliderInstance) {
        sliderInstance.destroy();
      }
    });

    instances = [];
  }

  document.addEventListener(PAGE_LEAVE, () => {
    destroy();
  });

  document.addEventListener(PAGE_ENTER, (event: CustomEvent) => {
    initialize(event.detail.container);
  });
}
