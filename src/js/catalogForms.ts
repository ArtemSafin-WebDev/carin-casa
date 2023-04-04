import { PAGE_ENTER } from "./constants/pageEnter";
import { PAGE_LEAVE } from "./constants/pageLeave";

function catalogForms() {
  let instances = [];
  function initialize(context = document) {
    if (instances.length) return;
    const forms: HTMLFormElement[] = Array.from(
      context.querySelectorAll(".catalog__filters-form")
    );

    const categoriesLinks: HTMLLinkElement[] = Array.from(
      context.querySelectorAll(".catalog__filters-categories-link")
    );

    const activeLink = categoriesLinks.find((link) =>
      link.classList.contains("active")
    );

    forms.forEach((form) => {
      const inputs = Array.from(
        form.querySelectorAll<HTMLInputElement>("input")
      );

      const inputsInstances = [];

      const handleSubmit = (event?: SubmitEvent) => {
        if (event) event.preventDefault();
        const formData = new FormData(form);
        const queryString = new URLSearchParams(formData as any).toString();

        const url = `${activeLink.href}&${queryString}`;

        console.log("URL", url);
        const redirectEvent = new CustomEvent("redirect", {
          bubbles: true,
          detail: {
            href: url,
          },
        });
        document.dispatchEvent(redirectEvent);
      };

      inputs.forEach((input) => {
        const handler = () => {
          if (window.matchMedia("(min-width: 641px)").matches) {
            handleSubmit();
          }
        };

        input.addEventListener("change", handler);

        inputsInstances.push({
          input,
          handler,
        });
      });

      form.addEventListener("submit", handleSubmit);
      form.addEventListener("reset", handleSubmit);

      instances.push({
        inputsInstances,
        form,
        formHandler: handleSubmit,
      });
    });
  }

  function destroy() {
    instances.forEach((instance) => {
      const { inputsInstances, form, formHandler } = instance;

      form.removeEventListener("submit", formHandler);

      inputsInstances.forEach((instance) => {
        const { input, handler } = instance;
        input.removeEventListener("change", handler);
        form.removeEventListener("reset", handler);
      });
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

export default catalogForms;
