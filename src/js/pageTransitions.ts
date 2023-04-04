import barba from "@barba/core";
import barbaPrefetch from "@barba/prefetch";
import { PAGE_ENTER } from "./constants/pageEnter";
import { PAGE_LEAVE } from "./constants/pageLeave";

import { mainLoader, overlayIn, overlayOut } from "./transitions";

barba.use(barbaPrefetch);

export default function pageTransitions() {
  if (document.body.classList.contains("admin-bar")) {
    return;
  }
  barba.init({
    transitions: [
      {
        name: "home",
        sync: false,
        to: { namespace: ["home"] },
        //@ts-ignore
        once() {
          console.log("Once");
          return mainLoader();
        },
        //@ts-ignore
        leave(data) {
          // return standardFadeOut(data);
          return overlayOut(data);
        },
        //@ts-ignore
        enter(data) {
          // return standardFadeIn(data);
          return overlayIn(data);
        },
      },
    ],
  });

  barba.hooks.afterEnter((data) => {
    console.log("After enter", data);
    const event = new CustomEvent(PAGE_ENTER, {
      bubbles: true,
      detail: {
        container: data.next.container,
        url: data.next.url,
      },
    });

    document.dispatchEvent(event);
  });
  barba.hooks.afterLeave((data) => {
    const event = new CustomEvent(PAGE_LEAVE, {
      bubbles: true,
      detail: {
        container: data.current.container,
      },
    });

    document.dispatchEvent(event);
  });

  document.addEventListener("redirect", (event: CustomEvent) => {
    const href = event.detail.href;
    if (href) {
      barba.go(href);
    }
  });
}
