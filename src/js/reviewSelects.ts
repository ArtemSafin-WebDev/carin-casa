import Select from "./classes/Select";
import { PAGE_ENTER } from "./constants/pageEnter";
import { PAGE_LEAVE } from "./constants/pageLeave";

function reviewSelects() {
  let instances: Select[] = [];

  function initialize(context = document) {
    if (instances.length) return;
    const selects = Array.from(
      context.querySelectorAll<HTMLElement>(".js-review-select")
    );
    selects.forEach((select) => {
      instances.push(new Select(select));
    });
  }

  function destroy() {
    instances.forEach((instance) => instance.destroy());
    instances = [];
  }

  document.addEventListener(PAGE_LEAVE, () => {
    destroy();
  });

  document.addEventListener(PAGE_ENTER, (event: CustomEvent) => {
    initialize(event.detail.container);
  });
}

export default reviewSelects;
