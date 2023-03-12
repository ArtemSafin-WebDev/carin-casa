import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "./plugins/ScrollSmoother.js";
import { primaryInput } from "detect-it";
import { PAGE_ENTER } from "./constants/pageEnter.js";
import { PAGE_LEAVE } from "./constants/pageLeave.js";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

//@ts-ignore
window.refresh = () => {
  ScrollTrigger.refresh();
};

export default function smoothScrolling() {
  let instances = [];
  function initialize(context = document) {
    if (instances.length) return;
    const wrapper = context.querySelector("#smooth-wrapper");
    const content = context.querySelector("#smooth-content");
    if (instances.length || !wrapper || !content) return;
    if (primaryInput !== "touch") {
      const instance = ScrollSmoother.create({
        smooth: 0.6,
        effects: true,
        wrapper,
        content,
      });

      console.log("Creating smooth scroll");

      instances.push(instance);
    }
  }

  function destroy() {
    instances.forEach((instance) => instance.kill());
    instances = [];
  }

  document.addEventListener(PAGE_LEAVE, () => {
    destroy();
  });

  document.addEventListener(PAGE_ENTER, (event: CustomEvent) => {
    initialize(event.detail.container);
    ScrollTrigger.refresh();
  });
}
