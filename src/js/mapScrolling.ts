import { PAGE_ENTER } from "./constants/pageEnter";
import { PAGE_LEAVE } from "./constants/pageLeave";
import { isMobile } from "./utils";

function mapScrolling() {
  let initialized = false;
  function setMapScroll() {
    if (!isMobile()) return;
    const mapWrapper = document.querySelector(".contacts__map-wrapper");
    if (!mapWrapper) return;
    const scrollAmount = mapWrapper.scrollWidth / 2.5;
    mapWrapper.scrollLeft = scrollAmount;
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
