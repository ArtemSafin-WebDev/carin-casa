import Menu from "./classes/Menu";
import { PAGE_ENTER } from "./constants/pageEnter";
import { PAGE_LEAVE } from "./constants/pageLeave";

export default function menu() {
  let instances: Menu[] = [];
  function initialize(context = document) {
    if (instances.length) return;
    const headers = Array.from(
      context.querySelectorAll<HTMLElement>(".page-header")
    );

    headers.forEach((header) => {
      const instance = new Menu(header);
      instances.push(instance);
    });
  }

  function destroy() {
    instances.forEach((instance) => instance.destroy());
    instances = [];
  }

  initialize();

  document.addEventListener(PAGE_LEAVE, () => {
    destroy();
  });

  document.addEventListener(PAGE_ENTER, (event: CustomEvent) => {
    initialize(event.detail.container);
  });
}
