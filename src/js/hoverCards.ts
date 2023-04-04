import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PAGE_ENTER } from "./constants/pageEnter";
import { PAGE_LEAVE } from "./constants/pageLeave";

gsap.registerPlugin(ScrollTrigger);

export default function hoverCards() {
  const CARD_SELECTOR = ".js-hover-card";
  const CONTENT_SELECTOR = ".js-hover-card-content";
  let instances: Array<{
    cards: HTMLLinkElement[];
    resizeObserver: ResizeObserver;
    mm: gsap.MatchMedia;
  }> = [];

  function initialize(context = document) {
    if (instances.length) return;
    const cards = Array.from(
      context.querySelectorAll<HTMLLinkElement>(CARD_SELECTOR)
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
        const getContentHeight = () =>
          parseFloat(
            getComputedStyle(card).getPropertyValue("--content-height")
          );
        const imageContainer: HTMLElement = card.querySelector(
          ".js-hover-card-image"
        );
        if (!imageContainer) return;
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: "center center",
            end: () => `center+=${card.offsetHeight * 1} center`,
            toggleActions: "play reverse play reverse",
          },
        });

        tl.to(imageContainer, {
          duration: 0.4,
          "clip-path": () => {
            const contentHeight = getContentHeight();
            console.log("Calculation clip path", contentHeight);

            const percentage =
              ((imageContainer.offsetHeight - contentHeight) /
                imageContainer.offsetHeight) *
              100;
            return `polygon(
              0 0,
              100% 0,
              100% ${percentage}%,
              0 ${percentage}%`;
          },
        });

        console.log("Content height", getContentHeight());
      });
    });

    instances.push({
      cards,
      resizeObserver,
      mm,
    });
  }

  function destroy() {
    instances.forEach((instance) => {
      const { cards, resizeObserver, mm } = instance;

      cards.forEach((card) => {
        resizeObserver.unobserve(card);
      });

      mm.revert();
    });

    instances = [];
  }

  document.addEventListener(PAGE_LEAVE, () => {
    destroy();
  });

  document.addEventListener(PAGE_ENTER, (event: CustomEvent) => {
    initialize(event.detail.container);
  });
}
