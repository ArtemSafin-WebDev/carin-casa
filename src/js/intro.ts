import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Swiper, { Controller, EffectFade } from "swiper";
import "swiper/css";
import "swiper/css/effect-fade";
import { PAGE_ENTER } from "./constants/pageEnter";
import { PAGE_LEAVE } from "./constants/pageLeave";

gsap.registerPlugin(ScrollTrigger);

export default function intro() {
  const SELECTOR = ".js-intro";

  let instances = [];

  function initialize(context = document) {
    if (instances.length) return;
    const elements: HTMLElement[] = Array.from(
      context.querySelectorAll(SELECTOR)
    );

    elements.forEach((element) => {
      const bgSlider =
        element.querySelector<HTMLDivElement>(".intro__bg-slider");
      const bgSliderContainer = element.querySelector<HTMLDivElement>(
        ".intro__bg-slider .swiper"
      );

      const contentSliderContainer = element.querySelector<HTMLDivElement>(
        ".intro__content-slider .swiper"
      );

      const linksContainer = element.querySelector<HTMLDivElement>(
        ".intro__desktop-categories"
      );
      const links = Array.from(
        element.querySelectorAll<HTMLLinkElement>(
          ".intro__desktop-categories-link"
        )
      );

      const contentSliderInstance = new Swiper(contentSliderContainer, {
        modules: [EffectFade, Controller],
        speed: 600,
        effect: "fade",
        allowTouchMove: false,
        fadeEffect: {
          crossFade: true,
        },
      });

      const bgSliderInstance = new Swiper(bgSliderContainer, {
        modules: [EffectFade, Controller],
        speed: 600,
        effect: "fade",
        allowTouchMove: false,
        fadeEffect: {
          crossFade: false,
        },
        on: {
          slideChange: (swiper) => {
            contentSliderInstance.slideTo(swiper.activeIndex + 1);
          },
        },
      });

      const linksInstances = [];

      links.forEach((link, linkIndex) => {
        const linkMouseEnterHandler = () => {
          links.forEach((link) => link.classList.remove("hovered"));
          link.classList.add("hovered");
          bgSliderInstance.slideTo(linkIndex);
          contentSliderInstance.slideTo(linkIndex + 1);
        };

        const linkMouseLeaveHandler = () => {
          link.classList.remove("hovered");
        };

        link.addEventListener("mouseenter", linkMouseEnterHandler);
        link.addEventListener("mouseleave", linkMouseLeaveHandler);

        linksInstances.push({
          link,
          linkMouseEnterHandler,
          linkMouseLeaveHandler,
        });
      });

      const linksContainerMouseEnterHandler = () => {
        linksContainer.classList.add("hover-inside");
        gsap.to(bgSlider, {
          autoAlpha: 1,
          duration: 0.6,
        });
      };

      const linksContainerMouseLeaveHandler = () => {
        linksContainer.classList.remove("hover-inside");
        contentSliderInstance.slideTo(0);
        gsap.to(bgSlider, {
          autoAlpha: 0,
          duration: 0.6,
        });
      };

      linksContainer?.addEventListener(
        "mouseenter",
        linksContainerMouseEnterHandler
      );
      linksContainer?.addEventListener(
        "mouseleave",
        linksContainerMouseLeaveHandler
      );

      instances.push({
        sliders: [contentSliderInstance, bgSliderInstance],
        linksContainer,
        linksContainerMouseEnterHandler,
        linksContainerMouseLeaveHandler,
        linksInstances,
      });
    });
  }

  function destroy() {
    instances.forEach((instance) => {
      const {
        sliders,
        linksContainer,
        linksContainerMouseEnterHandler,
        linksContainerMouseLeaveHandler,
        linksInstances,
      } = instance;

      sliders.forEach((slider) => slider.destroy());

      linksContainer?.removeEventListener(
        "mouseenter",
        linksContainerMouseEnterHandler
      );
      linksContainer?.removeEventListener(
        "mouseleave",
        linksContainerMouseLeaveHandler
      );

      linksInstances.forEach((instance) => {
        const { link, linkMouseEnterHandler, linkMouseLeaveHandler } = instance;

        link.removeEventListener("mouseenter", linkMouseEnterHandler);
        link.removeEventListener("mouseleave", linkMouseLeaveHandler);
      });
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
