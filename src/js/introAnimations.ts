import { PAGE_ENTER } from "./constants/pageEnter";
import { PAGE_LEAVE } from "./constants/pageLeave";

export default function introAnimations() {
  let instances = [];

  function initialize(context = document) {
    if (instances.length) return;
    const elements: HTMLElement[] = Array.from(
      context.querySelectorAll(
        ".page-header, .intro__content-slider, .intro__desktop-categories, .contacts__intro-text-content,.catalog__text-content, .standard-header__text-content"
      )
    );

    elements.forEach((element) => element.classList.add("show"));
  }

  function destroy() {
    instances = [];
  }

  document.addEventListener(PAGE_LEAVE, () => {
    destroy();
  });

  document.addEventListener(PAGE_ENTER, (event: CustomEvent) => {
    initialize(event.detail.container);
  });
}
