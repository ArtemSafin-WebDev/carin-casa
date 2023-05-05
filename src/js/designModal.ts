import ProductModal from "./classes/ProductModal";
import { PAGE_ENTER } from "./constants/pageEnter";
import { PAGE_LEAVE } from "./constants/pageLeave";

export default function designModal() {
  let instance: ProductModal | null = null;
  const element = document.querySelector<HTMLElement>(".js-design-modal");
  if (!element) return;
  function initialize() {
    if (instance) return;
    instance = new ProductModal(element, null, () => {
      //@ts-ignore
      if (window.ym) {
        //@ts-ignore
        window.ym(92972172, "reachGoal", "form_designer");
      }
    });
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
      target.matches(".js-open-design-modal") ||
      target.closest(".js-open-design-modal")
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
