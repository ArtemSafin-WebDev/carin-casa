import Configurator from "./classes/Configurator";
import { PAGE_ENTER } from "./constants/pageEnter";
import { PAGE_LEAVE } from "./constants/pageLeave";

export default function priceConfig() {
  let instances = [];
  function initialize(context = document) {
    if (instances.length) return;
    const elements: HTMLElement[] = Array.from(
      context.querySelectorAll(".js-price-configurator")
    );

    elements.forEach((element) => {
      const instance = new Configurator(element);
      instances.push(instance);
    });
  }

  function destroy() {
    instances.forEach((instance) => {
      instance.destroy();
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
