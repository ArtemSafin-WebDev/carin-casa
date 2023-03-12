import Swiper, { SwiperOptions } from "swiper";
import "swiper/css";
import { PAGE_ENTER } from "./constants/pageEnter";
import { PAGE_LEAVE } from "./constants/pageLeave";

export default function similarProductsSlider() {
  let instances = [];

  function initialize(context = document) {
    if (instances.length) return;
    const elements: HTMLElement[] = Array.from(
      context.querySelectorAll(".js-similar-products")
    );

    elements.forEach((element) => {
      const container: HTMLElement | null = element.querySelector(".swiper");
      if (!container) return;
      let sliderInstance: Swiper | null = null;

      const options: SwiperOptions = {
        slidesPerView: "auto",
        speed: 600,
        centeredSlides: true,
        loop: true,
        loopedSlides: 5,
        longSwipesRatio: 0.2,
      };

      sliderInstance = new Swiper(container, options);
      instances.push(sliderInstance);
    });
  }

  function destroy() {
    instances.forEach((instance) => {
      instance.destroy();
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
