import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

import { ITransitionData, IViewData } from "@barba/core";

gsap.registerPlugin(ScrollToPlugin);

export const standardFadeIn = (data: ITransitionData | IViewData) => {
  return gsap.from(data.next.container, {
    autoAlpha: 0,
    duration: 0.4,
  });
};

export const standardFadeOut = (data: ITransitionData | IViewData) => {
  gsap.set(data.current.container, {
    position: "absolute",
  });
  return gsap.to(data.current.container, {
    autoAlpha: 0,
    duration: 0.4,
  });
};

export const overlayOut = (data: ITransitionData | IViewData) => {
  gsap.set(data.current.container, {
    position: "absolute",
  });
  const overlay = document.querySelector(".overlay");

  const tl = gsap.timeline();

  return tl
    .fromTo(
      overlay,
      {
        top: "200%",
      },
      {
        top: "0%",
        duration: 0.8,
      }
    )
    .to(data.current.container, {
      autoAlpha: 0,
      duration: 0.2,
    });
};

export const overlayIn = (data: ITransitionData | IViewData) => {
  const overlay = document.querySelector(".overlay");

  const tl = gsap.timeline();

  return tl
    .from(data.next.container, {
      autoAlpha: 0,
      duration: 0.4,
    })
    .fromTo(
      overlay,
      {
        top: "0%",
      },
      {
        top: "-200%",
        duration: 0.8,
      }
    );
};

export const mainLoader = () => {
  const counter = {
    value: 100,
  };
  const loader = document.querySelector(".loader");

  const loaderPercentageNumber = loader.querySelector(
    ".loader__progress-percentage-number"
  );

  const progressBarInner = loader.querySelector(".loader__progress-bar-inner");

  const tl = gsap.timeline();

  console.log("Main loader", loader, loaderPercentageNumber);

  return tl
    .from(counter, {
      duration: 2,
      ease: "power3.inOut",
      value: 0,
      roundProps: "value",
      onUpdate: function () {
        const percentage = Math.ceil(counter.value / 10) * 10;
        console.log(percentage);

        loaderPercentageNumber.textContent = percentage.toString();
      },
    })
    .to(
      progressBarInner,
      {
        scaleX: 1,
        duration: 2,
        ease: "power3.inOut",
      },
      0
    )
    .to(loader, {
      autoAlpha: 0,
      duration: 0.2,
    });
};
