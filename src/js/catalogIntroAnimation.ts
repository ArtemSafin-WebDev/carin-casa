import { PAGE_ENTER } from "./constants/pageEnter";
import { PAGE_LEAVE } from "./constants/pageLeave";
import gsap from "gsap";

export default function catalogIntroAnimation() {
  let instances = [];
  function initialize(context = document) {
    if (instances.length) return;

    const elements: HTMLElement[] = Array.from(
      context.querySelectorAll(".catalog__header")
    );

    elements.forEach((element) => {
      const textContent = element.querySelector(".catalog__text-content");

      const tl = gsap.timeline();

      tl.to(textContent, {
        autoAlpha: 1,
        y: 0,
        duration: 0.4,
      });

      instances.push(tl);
    });
  }

  function destroy() {
    instances.forEach((instance) => instance.kill());
    instances = [];
  }

  document.addEventListener(PAGE_LEAVE, () => {
    destroy();
  });

  document.addEventListener(PAGE_ENTER, (event: CustomEvent) => {
    initialize(event.detail.container);
  });
}
