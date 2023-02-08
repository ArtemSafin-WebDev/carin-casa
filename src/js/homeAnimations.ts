import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function homeAnimations() {
  const intro = document.querySelector<HTMLElement>(".intro");
  if (intro) {
    let mm = gsap.matchMedia();
    const introParallax =
      intro.querySelector<HTMLDivElement>(".intro__parallax");
    mm.add("(min-width: 641px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: intro,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      tl.to(introParallax, {
        duration: 1,
        y: () => intro.offsetHeight * 0.5,
      });
    });
    // mm.add("(max-width: 640px)", () => {
    //   const tl = gsap.timeline({
    //     scrollTrigger: {
    //       trigger: intro,
    //       start: "top top",
    //       end: "bottom top",
    //       scrub: true,
    //     },
    //   });

    //   tl.to(introParallax, {
    //     duration: 1,
    //     yPercent: 100,
    //     ease: "none",
    //   });
    // });
  }

  const advantages: HTMLElement = document.querySelector(".advantages");

  if (advantages) {
    let mm = gsap.matchMedia();
    const cards = Array.from(
      advantages.querySelectorAll<HTMLLIElement>(".advantages__list-item")
    );

    mm.add("(min-width: 641px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: advantages,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      tl.from(cards, {
        duration: 1,
        y: 150,
        stagger: 0.2,
      });
    });
  }
}
