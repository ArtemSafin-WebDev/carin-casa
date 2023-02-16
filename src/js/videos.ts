import Video from "./classes/Video";

export default function videos() {
  const videos = Array.from(
    document.querySelectorAll<HTMLVideoElement>("video")
  );

  videos.forEach((video) => {
    new Video(video);
  });
}
