import ProductModal from "./classes/ProductModal";
import { PAGE_ENTER } from "./constants/pageEnter";
import { PAGE_LEAVE } from "./constants/pageLeave";

export default function developerModal() {
  let instance: ProductModal | null = null;
  const element = document.querySelector<HTMLElement>(".js-developer-modal");
  if (!element) return;
  function initialize() {
    if (instance) return;
    instance = new ProductModal(element, null, () => {});
  }

  function destroy() {
    if (instance) {
      instance.destroy();
      instance = null;
    }
  }

  document.addEventListener("click", (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (
      target.matches(".js-developer-modal-open") ||
      target.closest(".js-developer-modal-open")
    ) {
      if (instance) {
        event.preventDefault();
        instance.openModal();
      }
    }
  });

  document.addEventListener(PAGE_LEAVE, () => {
    destroy();
  });

  document.addEventListener(PAGE_ENTER, () => {
    initialize();
  });
}
