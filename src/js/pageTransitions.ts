import barba from "@barba/core";
import barbaPrefetch from "@barba/prefetch";
import { PAGE_ENTER } from "./constants/pageEnter";
import { PAGE_LEAVE } from "./constants/pageLeave";

import { mainLoader, overlayIn, overlayOut } from "./transitions";

barba.use(barbaPrefetch);

export default function pageTransitions() {
  if (document.body.classList.contains("admin-bar")) {
    const event = new CustomEvent(PAGE_ENTER, {
      bubbles: true,
      detail: {
        container: document,
      },
    });

    document.dispatchEvent(event);

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

  barba.hooks.afterOnce((data) => {
    const event = new CustomEvent(PAGE_ENTER, {
      bubbles: true,
      detail: {
        container: data.next.container,
      },
    });

    document.dispatchEvent(event);
  });
  barba.hooks.beforeOnce((data) => {
    const event = new CustomEvent(PAGE_LEAVE, {
      bubbles: true,
      detail: {
        container: data.current.container,
      },
    });

    document.dispatchEvent(event);
  });
  barba.hooks.afterEnter((data) => {
    const event = new CustomEvent(PAGE_ENTER, {
      bubbles: true,
      detail: {
        container: data.next.container,
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
}
