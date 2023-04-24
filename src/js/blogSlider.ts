import Swiper, { Navigation, Pagination } from "swiper";
import "swiper/css";
import { PAGE_ENTER } from "./constants/pageEnter";
import { PAGE_LEAVE } from "./constants/pageLeave";

export default function blogSlider() {
  let instances: Swiper[] = [];
  const SELECTOR = ".js-blog-slider";

  function initialize(context = document) {
    if (instances.length) return;
    const elements: HTMLElement[] = Array.from(
      context.querySelectorAll(SELECTOR)
    );

    elements.forEach((element) => {
      const container = element.querySelector<HTMLDivElement>(".swiper");

      let instance = new Swiper(container, {
        modules: [Navigation, Pagination],
        slidesPerView: 1,
        speed: 800,
        longSwipesRatio: 0.2,
        navigation: {
          nextEl: element.querySelector<HTMLButtonElement>(
            ".blog-content__slider-arrow--next"
          ),
          prevEl: element.querySelector<HTMLButtonElement>(
            ".blog-content__slider-arrow--prev"
          ),
        },
        pagination: {
          el: element.querySelector<HTMLDivElement>(
            ".blog-content__slider-bullets"
          ),
          type: "bullets",
        },
      });
      instances.push(instance);
    });
  }

  function destroy() {
    instances.forEach((instance) => instance.destroy());
    instances = [];
  }

  function initializeACFSlider($block) {
    console.log("Native slider element", $block[0]);
    initialize($block[0]);
  }

  //@ts-ignore
  if (window.acf) {
    //@ts-ignore
    window.acf.addAction(
      "render_block_preview/type=blog-slider",
      initializeACFSlider
    );
  }

  document.addEventListener(PAGE_LEAVE, () => {
    destroy();
  });

  document.addEventListener(PAGE_ENTER, (event: CustomEvent) => {
    initialize(event.detail.container);
  });
}
