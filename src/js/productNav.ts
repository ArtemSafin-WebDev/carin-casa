import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { PAGE_ENTER } from "./constants/pageEnter";
import { PAGE_LEAVE } from "./constants/pageLeave";

gsap.registerPlugin(ScrollTrigger);

export default function productNav() {
  let instances = [];

  function initialize(context = document) {
    if (instances.length) return;
    const elements: HTMLElement[] = Array.from(
      context.querySelectorAll(".product__nav")
    );

    elements.forEach((element) => {
      const instance = ScrollTrigger.create({
        trigger: element,
        start: "top top",
        end: 99999999,
        pin: true,
        pinSpacing: false,
      });

      instances.push(instance);
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
