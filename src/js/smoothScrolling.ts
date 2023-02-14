import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "./plugins/ScrollSmoother.js";
import { primaryInput } from "detect-it";
import { isMobile } from "./utils.js";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

export default function smoothScrolling() {
  if (primaryInput !== "touch" || isMobile()) {
    ScrollSmoother.create({
      smooth: 0.6,
      effects: true,
    });
  }
}
