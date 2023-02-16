import Validator from "./classes/Validator";

export default function forms() {
  const elements: HTMLFormElement[] = Array.from(
    document.querySelectorAll(".js-form")
  );

  elements.forEach((form) => {
    const validator = new Validator(form);

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      validator.validate();

      //   if (validator.valid) {
      //     const formData = new FormData(form);
      //   }
    });
  });
}
