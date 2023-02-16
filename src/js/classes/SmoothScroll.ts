import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "../plugins/ScrollSmoother.js";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

class SmoothScroll {
  private scrollSmootherInstance: any;

  private static instance: SmoothScroll;
  private constructor() {}

  public static getInstance(): SmoothScroll {
    if (!SmoothScroll.instance) {
      SmoothScroll.instance = new SmoothScroll();
    }
    return SmoothScroll.instance;
  }

  public init() {
    if (!this.scrollSmootherInstance) {
      this.scrollSmootherInstance = ScrollSmoother.create({
        smooth: 0.6,
        effects: true,
      });
    }
  }
}

export default SmoothScroll;
