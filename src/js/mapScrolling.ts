import { PAGE_ENTER } from "./constants/pageEnter";
import { PAGE_LEAVE } from "./constants/pageLeave";
import { isMobile } from "./utils";

function mapScrolling() {
  let initialized = false;
  let prevWidth = 0;
  function setMapScroll() {
    if (!isMobile()) return;
    const mapWrapper = document.querySelector(".contacts__map-wrapper");
    if (!mapWrapper) return;
    if (window.innerWidth === prevWidth) return;
    const amount = mapWrapper.hasAttribute("data-scroll-amount")
      ? Number(mapWrapper.getAttribute("data-scroll-amount"))
      : 2.5;
    const scrollAmount = mapWrapper.scrollWidth / amount;
    mapWrapper.scrollLeft = scrollAmount;
    prevWidth = window.innerWidth;
  }

  function initialize(context = document) {
    if (initialized) return;
    const mapWrapper = context.querySelector(".contacts__map-wrapper");
    if (!mapWrapper) return;
    setMapScroll();
    window.addEventListener("resize", setMapScroll);

    initialized = true;
  }

  function destroy() {
    window.removeEventListener("resize", setMapScroll);
    initialized = false;
    prevWidth = 0;
  }

  initialize();

  document.addEventListener(PAGE_LEAVE, () => {
    destroy();
  });

  document.addEventListener(PAGE_ENTER, (event: CustomEvent) => {
    initialize(event.detail.container);
  });
}

export default mapScrolling;
