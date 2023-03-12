import Video from "./classes/Video";
import { PAGE_ENTER } from "./constants/pageEnter";
import { PAGE_LEAVE } from "./constants/pageLeave";

export default function videos() {
  let instances: Video[] = [];
  function initialize(context = document) {
    if (instances.length) return;
    const videos = Array.from(
      context.querySelectorAll<HTMLVideoElement>("video")
    );

    videos.forEach((video) => {
      const instance = new Video(video);
      instances.push(instance);
    });
  }

  function destroy() {
    instances.forEach((instance) => instance.destroy());
    instances = [];
  }

  initialize();

  document.addEventListener(PAGE_LEAVE, () => {
    destroy();
  });

  document.addEventListener(PAGE_ENTER, (event: CustomEvent) => {
    initialize(event.detail.container);
  });
}
