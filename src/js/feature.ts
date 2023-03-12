import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PAGE_ENTER } from "./constants/pageEnter";
import { PAGE_LEAVE } from "./constants/pageLeave";

gsap.registerPlugin(ScrollTrigger);

export default function featureShowMore() {
  const SELECTOR = ".feature__show-more";
  let instances: Array<
    [element: HTMLElement, handler: (event: MouseEvent) => void]
  > = [];

  function initialize(context = document) {
    if (instances.length) return;
    const elements: HTMLElement[] = Array.from(
      context.querySelectorAll(SELECTOR)
    );

    elements.forEach((element) => {
      const handler = (event: MouseEvent) => {
        event.preventDefault();
        element.remove();
        document.documentElement.classList.add("feature-shown");
        ScrollTrigger.refresh();
      };
      element.addEventListener("click", handler);
      instances.push([element, handler]);
    });
  }

  function destroy() {
    document.documentElement.classList.remove("feature-shown");

    instances.forEach((instance) => {
      const [element, handler] = instance;
      element.removeEventListener("click", handler);
    });

    instances = [];
  }

  initialize();

  document.addEventListener(PAGE_LEAVE, () => {
    destroy();
  });

  document.addEventListener(PAGE_ENTER, (event: CustomEvent) => {
    initialize(event.detail.container);
  });
}
