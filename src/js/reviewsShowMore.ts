import { PAGE_ENTER } from "./constants/pageEnter";
import { PAGE_LEAVE } from "./constants/pageLeave";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import axios from "axios";
import Masonry from "masonry-layout";
import ImagesLoaded from "imagesloaded";

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

export default function reviewsShowMore() {
  let instances: Array<{
    link: HTMLLinkElement;
    handler: (event: MouseEvent) => void;
    masonry: Masonry;
    imgLoad: ImagesLoaded.ImagesLoaded;
    onAlways: () => void;
    onLayout: () => void;
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

      const imgLoad = ImagesLoaded(element);

      let masonry: Masonry | null = null;

      function onLayout() {
        ScrollTrigger.refresh();
      }

      function onAlways() {
        masonry = new Masonry(list, {
          itemSelector: ".reviews__list-item",
          gutter: 10,
          transitionDuration: "0.8s",
        });

        // masonry.on("layoutComplete", onLayout);
      }
      imgLoad.on("always", onAlways);

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
        link.disabled = true;
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
        } finally {
          link.disabled = false;
        }

        const parser = new DOMParser();
        const nextPageHtml = parser.parseFromString(data, "text/html");
        const nextListItems = Array.from(
          nextPageHtml.querySelectorAll<HTMLLIElement>(".reviews__list-item")
        );
        const nextBtn = nextPageHtml.querySelector<HTMLButtonElement>(
          ".js-reviews-show-more"
        );

        const imagesLoading = nextListItems.map((item) => {
          const image = item.querySelector<HTMLImageElement>("img");
          return new Promise<HTMLImageElement>((resolve, reject) => {
            image.onload = () => resolve(image);
            image.onerror = reject;
          });
        });

        console.log("images loading", imagesLoading);

        console.log("next page list items", nextListItems);
        console.log("next page HTML", nextPageHtml);

        if (nextListItems) {
          if (refresh) {
            const currentListItems = Array.from<HTMLLIElement>(
              element.querySelectorAll(".reviews__list-item")
            );
            masonry.remove(currentListItems);
          }
          // imagesLoading.forEach((imageLoading) =>
          //   imageLoading.then((image) => {
          //     gsap.fromTo(
          //       image,
          //       {
          //         autoAlpha: 0,
          //       },
          //       {
          //         autoAlpha: 1,
          //         duration: 0.4,
          //       }
          //     );
          //   })
          // );
          list.append(...nextListItems);
          masonry.appended(nextListItems);
        }

        if (!nextBtn) {
          // link.remove();
          link.style.display = "none";
        } else {
          link.style.display = "";
        }

        if (imagesLoading.length) {
          Promise.allSettled(imagesLoading).then(() => {
            console.log("Images loaded", imagesLoading);
            requestAnimationFrame(() => {
              if (masonry) masonry.layout();
              ScrollTrigger.refresh();
            });
          });
        } else {
          requestAnimationFrame(() => {
            if (masonry) masonry.layout();
            ScrollTrigger.refresh();
          });
        }

        // requestAnimationFrame(() => {
        //   ScrollTrigger.refresh();
        // });
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
        masonry,
        imgLoad,
        onAlways,
        onLayout,
      });
    });
  }

  function destroy() {
    instances.forEach(
      ({ link, handler, masonry, imgLoad, onAlways, onLayout }) => {
        link.removeEventListener("click", handler);
        imgLoad.off("always", onAlways);
        masonry.off("layoutComplete", onLayout);
        masonry.destroy();
      }
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
