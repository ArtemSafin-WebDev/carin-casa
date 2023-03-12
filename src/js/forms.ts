import Validator from "./classes/Validator";
import { PAGE_ENTER } from "./constants/pageEnter";
import { PAGE_LEAVE } from "./constants/pageLeave";

export default function forms() {
  let instances = [];

  function initialize(context = document) {
    if (instances.length) return;
    const elements: HTMLFormElement[] = Array.from(
      context.querySelectorAll(".js-form")
    );
    elements.forEach((form) => {
      const validator = new Validator(form);

      const handleSubmit = (event) => {
        event.preventDefault();
        validator.validate();
      };

      form.addEventListener("submit", handleSubmit);

      instances.push({
        validator,
        handleSubmit,
        form,
      });
    });
  }

  function destroy() {
    instances.forEach((instance) => {
      const { validator, handleSubmit, form } = instance;
      validator.destroy();
      form.removeEventListener("submit", handleSubmit);
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
