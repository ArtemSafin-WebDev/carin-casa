import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { PAGE_ENTER } from "./constants/pageEnter";
import { PAGE_LEAVE } from "./constants/pageLeave";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

export default function productNav() {
  let instances: Array<{
    trigger: ScrollTrigger;
    linksTriggers: ScrollTrigger[];
  }> = [];

  function initialize(context = document) {
    if (instances.length) return;
    const elements: HTMLElement[] = Array.from(
      context.querySelectorAll(".product__nav")
    );

    elements.forEach((element) => {
      const links: HTMLLinkElement[] = Array.from(
        element.querySelectorAll(".product__nav-link")
      );

      const productNavList: HTMLElement =
        element.querySelector(".product__nav-list");
      const instance = ScrollTrigger.create({
        trigger: element,
        start: "top top",
        end: 99999999,
        pin: true,
        pinSpacing: false,
      });

      const linksTriggers: ScrollTrigger[] = [];

      links.forEach((link) => {
        const url = new URL(link.href);
        const hash = url.hash;
        console.log("Hash", hash);
        const correspondingElement: HTMLElement = context.querySelector(hash);
        console.log("Corresponding element", correspondingElement);

        const trigger = ScrollTrigger.create({
          trigger: correspondingElement,
          start: () => `top top+=${productNavList.offsetHeight + 52}`,
          end: () => `+=${correspondingElement.offsetHeight}`,
          onToggle: (self) => {
            if (self.isActive) {
              link.classList.add("active");

              gsap.to(productNavList, {
                duration: 0.4,
                ease: "power2.out",
                scrollTo: {
                  x: link,
                  autoKill: true,
                  offsetX: parseFloat(
                    window
                      .getComputedStyle(productNavList, null)
                      .getPropertyValue("padding-left")
                  ),
                },
              });
            } else {
              link.classList.remove("active");
            }
          },
        });

        linksTriggers.push(trigger);
      });

      instances.push({
        trigger: instance,
        linksTriggers,
      });
    });
  }

  function destroy() {
    instances.forEach((instance) => {
      const { trigger, linksTriggers } = instance;
      trigger.kill();
      linksTriggers.forEach((trigger) => trigger.kill());
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
