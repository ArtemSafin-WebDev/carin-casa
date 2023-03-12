import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PAGE_ENTER } from "./constants/pageEnter";
import { PAGE_LEAVE } from "./constants/pageLeave";

gsap.registerPlugin(ScrollTrigger);

export default function introParallax() {
  let instances: gsap.MatchMedia[] = [];
  function initialize(context = document) {
    if (instances.length) return;
    const intro = context.querySelector<HTMLElement>(".intro");
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

      instances.push(mm);
    }
  }
  function destroy() {
    instances.forEach((instance) => {
      instance.kill();
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
