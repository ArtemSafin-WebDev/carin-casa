import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "./plugins/scrollSmoother.js";
import { primaryInput } from "detect-it";
// import { debounce } from "lodash";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

export default function smoothScrolling() {
  if (primaryInput !== "touch") {
    ScrollSmoother.create({
      smooth: 0.6,
      effects: true,
    });

    // let previousWidth = 0;

    // window.addEventListener(
    //   "resize",
    //   debounce(() => {
    //     setTimeout(() => {
    //       if (previousWidth !== window.innerWidth) {
    //         ScrollTrigger.refresh();
    //       }
    //       previousWidth = window.innerWidth;
    //     }, 5000);
    //   }, 200)
    // );
    // @ts-ignore
    window.refresh = () => {
      ScrollTrigger.refresh();
    };
  }
}
