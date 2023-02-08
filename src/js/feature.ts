import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function featureShowMore() {
  const SELECTOR = ".feature__show-more";
  const elements: HTMLElement[] = Array.from(
    document.querySelectorAll(SELECTOR)
  );

  elements.forEach((element) => {
    element.addEventListener("click", (event) => {
      event.preventDefault();
      element.remove();
      document.documentElement.classList.add("feature-shown");
      ScrollTrigger.refresh();
    });
  });
}
