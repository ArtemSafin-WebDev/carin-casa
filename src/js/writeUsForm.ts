import Validator from "./classes/Validator";
import { PAGE_ENTER } from "./constants/pageEnter";
import { PAGE_LEAVE } from "./constants/pageLeave";
import axios from "axios";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function writeUsForm() {
  let instances = [];

  function initialize(context = document) {
    if (instances.length) return;
    const elements: HTMLFormElement[] = Array.from(
      context.querySelectorAll(".js-write-us-form")
    );

    elements.forEach((form) => {
      const validator = new Validator(form);
      const success = document.querySelector("#form-status-ok");
      const error = document.querySelector("#form-status-error");

      const controller = new AbortController();

      const handleSubmit = (event: MouseEvent) => {
        event.preventDefault();
        validator.validate();

        if (validator.valid) {
          const formData = new FormData(form);

          axios
            .post(form.action, formData, {
              signal: controller.signal,
              headers: {
                "Content-Type": "multipart/form-data",
              },
            })
            .then((res) => {
              console.log(res.data);
              if (res.data.status === "mail_sent" && success) {
                form.reset();
                error.classList.remove("active");
                success.classList.add("active");

                if (form.matches(".product__has-questions-form")) {
                  //@ts-ignore
                  if (window.ym) {
                    //@ts-ignore
                    window.ym(92972172, "reachGoal", "form_ask");
                  }
                } else {
                  //@ts-ignore
                  if (window.ym) {
                    //@ts-ignore
                    window.ym(92972172, "reachGoal", "form_feedback");
                  }
                }

                setTimeout(() => {
                  success.classList.remove("active");
                }, 5000);
              }
            })
            .catch(() => {
              if (error) {
                success.classList.remove("active");
                error.classList.add("active");

                setTimeout(() => {
                  error.classList.remove("active");
                }, 5000);
              }
            });
        }
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
