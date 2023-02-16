import { gsap } from "gsap";
import MOBILE_WIDTH from "../constants/mobileWidth";

class Video {
  private mql: MediaQueryList;
  constructor(private video: HTMLVideoElement) {
    this.video = video;
    this.mql = window.matchMedia(MOBILE_WIDTH);
    this.video.addEventListener("play", this.handleCanPlay);
    this.mql.addEventListener("change", this.handleWidthChange);
    this.handleWidthChange(this.mql);
  }

  private handleCanPlay = () => {
    gsap.to(this.video, {
      autoAlpha: 1,
      duration: 0.4,
    });
  };

  private handleWidthChange = (e: MediaQueryListEvent | MediaQueryList) => {
    if (!e.matches) {
      this.playVideo();
    } else {
      this.stopVideo();
    }
  };

  public playVideo() {
    this.video.setAttribute("autoplay", "");
    this.video.play();
  }
  public stopVideo() {
    this.video.removeAttribute("autoplay");
    this.video.pause();
    gsap.to(this.video, {
      autoAlpha: 0,
      duration: 0.4,
    });
  }

  public destroy() {
    this.video.removeEventListener("canplaythrough", this.handleCanPlay);
    this.mql.removeEventListener("change", this.handleWidthChange);
  }
}

export default Video;
