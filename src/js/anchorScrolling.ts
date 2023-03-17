import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollToPlugin);

export default function anchorLinks() {
  let offset = 50;
  const DURATION = 1.4;
  const scrollByHash = (hash: string) => {
    const elementToScroll = document.querySelector(hash);
    const productNav: HTMLElement =
      document.querySelector(".product__nav-list");
    if (elementToScroll && !elementToScroll.matches(".js-modal")) {
      gsap.to(window, {
        duration: DURATION,
        ease: "power2.out",
        scrollTo: {
          y: elementToScroll,
          autoKill: false,
          offsetY: productNav ? productNav.offsetHeight + offset : offset,
        },
      });
    } else {
      console.error("No element to scroll");
    }
  };
  document.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;
    if (target.matches("a") || target.closest("a")) {
      const link = target.matches("a") ? target : target.closest("a");

      //@ts-ignore
      const hash = link.hash;

      //@ts-ignore
      const url = new URL(link.href);
      //@ts-ignore
      const pageUrl = new URL(window.location);

      if (pageUrl.pathname !== url.pathname) return;

      if (hash) {
        event.preventDefault();
        scrollByHash(hash);
      }
    }
  });

  if (window.location.hash) {
    scrollByHash(window.location.hash);
  }
}
