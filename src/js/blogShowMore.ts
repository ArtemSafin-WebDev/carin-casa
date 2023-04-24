import { PAGE_ENTER } from "./constants/pageEnter";
import { PAGE_LEAVE } from "./constants/pageLeave";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import axios from "axios";

gsap.registerPlugin(ScrollToPlugin);

export default function blogShowMore() {
  let page = 1;
  let instances: Array<{
    link: HTMLLinkElement;
    loadMorePosts: (event: MouseEvent) => Promise<void>;
  }> = [];

  function initialize(context = document) {
    if (instances.length) return;
    const links = Array.from(
      context.querySelectorAll<HTMLLinkElement>(".js-blog-show-more")
    );
    const list = context.querySelector<HTMLUListElement>(".blog__list");
    const controller = new AbortController();

    async function loadMorePosts(event: MouseEvent) {
      event.preventDefault();
      page++;
      let data = "";
      this.disabled = true;

      try {
        const response = await axios.get(this.href, {
          signal: controller.signal,
          params: {
            pagenumber: page,
          },
        });

        data = response.data as string;
      } catch (err) {
        this.disabled = false;
        console.error(err);
        return;
      }

      const parser = new DOMParser();
      const nextPageHtml = parser.parseFromString(data, "text/html");
      const nextListItems = Array.from(
        nextPageHtml.querySelectorAll<HTMLLIElement>(".blog__list-item")
      );
      const nextBtn =
        nextPageHtml.querySelector<HTMLButtonElement>(".blog__show-more");

      if (nextListItems) {
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
        this.remove();
      }

      this.disabled = false;
    }

    links.forEach((link) => {
      link.addEventListener("click", loadMorePosts);
      instances.push({ link, loadMorePosts });
    });
  }

  function destroy() {
    page = 1;
    instances.forEach(({ link, loadMorePosts }) =>
      link.removeEventListener("click", loadMorePosts)
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
