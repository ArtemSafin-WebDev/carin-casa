import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "./plugins/scrollSmoother.js";
import { primaryInput } from "detect-it";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

export default function smoothScrolling() {
  if (primaryInput !== "touch") {
    ScrollSmoother.create({
      smooth: 0.6,
      effects: true,
    });
  }
}
