import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Swiper, { SwiperOptions, Controller, EffectFade } from "swiper";
import "swiper/css";
import "swiper/css/effect-fade ";

gsap.registerPlugin(ScrollTrigger);

export default function intro() {
  const SELECTOR = ".js-intro";
  const elements: HTMLElement[] = Array.from(
    document.querySelectorAll(SELECTOR)
  );
  elements.forEach((element) => {
    const videoWrapper = element.querySelector<HTMLDivElement>(
      ".intro__video-wrapper"
    );
    const videoElement = element.querySelector<HTMLVideoElement>("video");

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
          bgSliderInstance.slideTo(linkIndex);
          contentSliderInstance.slideTo(linkIndex + 1);
        });
      });

      linksContainer?.addEventListener("mouseenter", () => {
        gsap.to(bgSlider, {
          autoAlpha: 1,
          duration: 0.6,
        });
      });
      linksContainer?.addEventListener("mouseleave", () => {
        contentSliderInstance.slideTo(0);
        gsap.to(bgSlider, {
          autoAlpha: 0,
          duration: 0.6,
        });
      });
    }

    videoElement?.addEventListener("canplaythrough", () => {
      console.log("Can play event");
      gsap.to(videoWrapper, {
        autoAlpha: 1,
        duration: 0.4,
      });
    });
  });
}
