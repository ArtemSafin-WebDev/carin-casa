import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function hoverCards() {
  const CARD_SELECTOR = ".js-hover-card";
  const CONTENT_SELECTOR = ".js-hover-card-content";
  const cards = Array.from(
    document.querySelectorAll<HTMLLinkElement>(CARD_SELECTOR)
  );

  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const target = entry.target as HTMLElement;
      const content = target.querySelector<HTMLElement>(CONTENT_SELECTOR);
      target.style.setProperty(
        "--content-height",
        content?.offsetHeight + "px"
      );
    }
  });

  cards.forEach((card) => {
    resizeObserver.observe(card);
  });

  let mm = gsap.matchMedia();

  mm.add("(max-width: 640px)", () => {
    cards.forEach((card) => {
      ScrollTrigger.create({
        trigger: card,
        start: "top center",
        end: () => `top+=${card.offsetHeight * 1.5} center`,
        toggleClass: "hovered",
      });
    });
  });
}
