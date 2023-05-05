import { PAGE_ENTER } from "./constants/pageEnter";
import { PAGE_LEAVE } from "./constants/pageLeave";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import axios from "axios";

gsap.registerPlugin(ScrollToPlugin);

export default function reviewsShowMore() {
  let instances: Array<{
    link: HTMLLinkElement;
    handler: (event: MouseEvent) => void;
  }> = [];

  function initialize(context = document) {
    if (instances.length) return;

    const reviews = Array.from(
      context.querySelectorAll<HTMLElement>(".js-reviews")
    );

    reviews.forEach((element) => {
      let page = 1;
      const inputs = Array.from(
        element.querySelectorAll<HTMLInputElement>('input[type="radio"]')
      );

      const typeInput = element.querySelector<HTMLInputElement>(
        'input[type="hidden"]'
      );
      const link = element.querySelector<HTMLLinkElement>(
        ".js-reviews-show-more"
      );
      const form = element.querySelector<HTMLFormElement>("form");
      const url = form.action;
      const list = element.querySelector<HTMLUListElement>(".reviews__list");
      const controller = new AbortController();

      async function loadPosts(refresh = false) {
        let data = "";
        if (!refresh) {
          page++;
        } else {
          page = 1;
        }
        const currentCategory = inputs
          .find((input) => input.checked)
          ?.value.trim();
        try {
          const params = {
            pagenumber: page,
            type: typeInput.value.trim(),
            category: currentCategory,
          };
          console.log("Params", params);
          const response = await axios.get(url, {
            signal: controller.signal,
            params: params,
          });

          data = response.data as string;
        } catch (err) {
          console.error(err);
          return;
        }

        const parser = new DOMParser();
        const nextPageHtml = parser.parseFromString(data, "text/html");
        const nextListItems = Array.from(
          nextPageHtml.querySelectorAll<HTMLLIElement>(".reviews__list-item")
        );
        const nextBtn = nextPageHtml.querySelector<HTMLButtonElement>(
          ".js-reviews-show-more"
        );

        console.log("next page list items", nextListItems);
        console.log("next page HTML", nextPageHtml);

        if (nextListItems) {
          if (refresh) {
            list.innerHTML = "";
          }
          list.append(...nextListItems);
          gsap.fromTo(
            nextListItems,
            {
              autoAlpha: 0,
            },
            {
              autoAlpha: 1,
              duration: 0.4,
            }
          );
        }

        if (!nextBtn) {
          link.remove();
        }
      }

      inputs.forEach((input) =>
        input.addEventListener("change", () => {
          loadPosts(true);
        })
      );
      const submitHandler = (event: SubmitEvent) => {
        event.preventDefault();
        loadPosts(true);
      };

      form.addEventListener("submit", submitHandler);

      const handler = (event: MouseEvent) => {
        event.preventDefault();
        loadPosts();
      };

      link.addEventListener("click", handler);

      instances.push({
        link,
        handler,
      });
    });
  }

  function destroy() {
    instances.forEach(({ link, handler }) =>
      link.removeEventListener("click", handler)
    );
    instances = [];
  }

  document.addEventListener(PAGE_LEAVE, () => {
    destroy();
  });

  document.addEventListener(PAGE_ENTER, (event: CustomEvent) => {
    initialize(event.detail.container);
  });
}
