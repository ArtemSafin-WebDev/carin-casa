import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function accordions() {
  const SPEED = 0.3;

  const openAccordion = (element: HTMLElement) => {
    gsap.to(element, {
      height: "auto",
      duration: SPEED,
      onComplete: () => ScrollTrigger.refresh(),
    });
  };
  const closeAccordion = (element: HTMLElement) => {
    gsap.to(element, {
      height: 0,
      duration: SPEED,
      onComplete: () => ScrollTrigger.refresh(),
    });
  };

  document.addEventListener("click", (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (
      target.matches(".js-accordion-btn") ||
      target.closest(".js-accordion-btn")
    ) {
      const btn = target.matches(".js-accordion-btn")
        ? target
        : target.closest(".js-accordion-btn");
      const element = btn.closest<HTMLElement>(".js-accordion");
      const content = element.querySelector<HTMLElement>(
        ".js-accordion-content"
      );
      const elements: HTMLElement[] = Array.from(
        document.querySelectorAll(".js-accordion")
      );

      event.preventDefault();

      if (element.hasAttribute("data-close-other")) {
        elements.forEach((otherElement) => {
          if (otherElement !== element) {
            if (otherElement.classList.contains("active")) {
              const content = otherElement.querySelector<HTMLElement>(
                ".js-accordion-content"
              );
              closeAccordion(content);
              otherElement.classList.remove("active");
            }
          }
        });
      }

      if (element.classList.contains("active")) {
        closeAccordion(content);
      } else {
        openAccordion(content);
      }
      element.classList.toggle("active");
    }
  });
}
