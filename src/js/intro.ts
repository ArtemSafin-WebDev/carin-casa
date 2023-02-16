import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Swiper, { Controller, EffectFade } from "swiper";
import "swiper/css";
import "swiper/css/effect-fade ";

gsap.registerPlugin(ScrollTrigger);

export default function intro() {
  const SELECTOR = ".js-intro";
  const elements: HTMLElement[] = Array.from(
    document.querySelectorAll(SELECTOR)
  );
  elements.forEach((element) => {
    const bgSlider = element.querySelector<HTMLDivElement>(".intro__bg-slider");
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

    if (bgSliderContainer && contentSliderContainer) {
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

      links.forEach((link, linkIndex) => {
        link.addEventListener("mouseenter", () => {
          links.forEach((link) => link.classList.remove("hovered"));
          link.classList.add("hovered");
          bgSliderInstance.slideTo(linkIndex);
          contentSliderInstance.slideTo(linkIndex + 1);
        });

        link.addEventListener("mouseleave", () => {
          link.classList.remove("hovered");
        });
      });

      linksContainer?.addEventListener("mouseenter", () => {
        linksContainer.classList.add("hover-inside");
        gsap.to(bgSlider, {
          autoAlpha: 1,
          duration: 0.6,
        });
      });
      linksContainer?.addEventListener("mouseleave", () => {
        linksContainer.classList.remove("hover-inside");
        contentSliderInstance.slideTo(0);
        gsap.to(bgSlider, {
          autoAlpha: 0,
          duration: 0.6,
        });
      });
    }
  });
}
