import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PAGE_ENTER } from "./constants/pageEnter";
import { PAGE_LEAVE } from "./constants/pageLeave";

gsap.registerPlugin(ScrollTrigger);

function reveal(selector = ".js-reveal-block") {
  let instances = [];

  function initialize(context = document) {
    if (instances.length) return;
    const elements: HTMLElement[] = Array.from(
      context.querySelectorAll(selector)
    );

    console.log("Creating revealable elements", elements);
    elements.forEach((element) => {
      const instance = ScrollTrigger.create({
        trigger: element,
        start: "top+=30 bottom",
        end: "bottom top",
        onEnter: () => {
          element.classList.add("revealed");
        },
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

export default reveal;
