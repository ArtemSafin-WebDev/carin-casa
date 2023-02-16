import { isMobile } from "./utils";

function setMapScroll() {
  if (!isMobile()) return;
  const mapWrapper = document.querySelector(".contacts__map-wrapper");
  if (!mapWrapper) return;
  const scrollAmount = mapWrapper.scrollWidth / 2.5;
  console.log("Scroll amount", scrollAmount);
  mapWrapper.scrollLeft = scrollAmount;
}

function initMapScrolling() {
  const mapWrapper = document.querySelector(".contacts__map-wrapper");
  if (!mapWrapper) return;
  setMapScroll();
  window.addEventListener("resize", setMapScroll);
}

// function destroyMapScrolling() {
//   window.removeEventListener("resize", setMapScroll);
// }

function mapScrolling() {
  initMapScrolling();
}

export default mapScrolling;
