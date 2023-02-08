import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function reveal(selector = ".js-reveal-block") {
  const elements: HTMLElement[] = Array.from(
    document.querySelectorAll(selector)
  );

  elements.forEach((element) => {
    ScrollTrigger.create({
      trigger: element,
      start: "top+=30 bottom",
      end: "bottom top",
      onEnter: () => {
        element.classList.add("revealed");
      },
    });
  });
}

export default reveal;
