import "virtual:svg-icons-register";
import "./lazyload";

import hoverCards from "./hoverCards";
import detailSlider from "./detailSlider";
import featureShowMore from "./feature";
import menu from "./menu";
import intro from "./intro";
import smoothScrolling from "./smoothScrolling";
import introParallax from "./introParallax";
import reveal from "./reveal";
import catalogFilters from "./catalogFilters";
import forms from "./subscriptionForm";
import videos from "./videos";
import mapScrolling from "./mapScrolling";
import pageTransitions from "./pageTransitions";
import contactsParallax from "./contactsParallax";
import introMobileSlider from "./introMobileSlider";
import similarProductsSlider from "./similarProductsSlider";
import productSlider from "./productSlider";
import anchorLinks from "./anchorScrolling";
import productNav from "./productNav";
import materials from "./materials";
import priceConfig from "./priceConfig";
import { PAGE_ENTER } from "./constants/pageEnter";
import writeUsForm from "./writeUsForm";
import catalogForms from "./catalogForms";
import introAnimations from "./introAnimations";

import productIntroParallax from "./productIntroParallax";
import catalogParallax from "./catalogParallax";

import setScrollbarWidth from "./scrollbarWidth";
import standardHeaderParallax from "./standardHeaderParallax";
import accordions from "./accordions";
import designProjectsSlider from "./designProjectsSlider";
import designModal from "./designModal";

import "../css/style.css";
import blogSlider from "./blogSlider";
import otherNewsSlider from "./otherNewsSlider";
import blogShowMore from "./blogShowMore";

document.addEventListener("DOMContentLoaded", () => {
  setScrollbarWidth();
  pageTransitions();
  smoothScrolling();
  hoverCards();
  detailSlider();
  featureShowMore();
  intro();
  menu();
  introParallax();
  contactsParallax();
  reveal();
  catalogFilters();
  forms();
  videos();
  mapScrolling();

  introMobileSlider();
  similarProductsSlider();
  productSlider();
  anchorLinks();
  productNav();
  materials();
  priceConfig();
  writeUsForm();
  catalogForms();
  introAnimations();
  productIntroParallax();
  catalogParallax();
  standardHeaderParallax();
  accordions();
  designProjectsSlider();
  designModal();
  blogSlider();
  otherNewsSlider();
  blogShowMore();

  if (document.body.classList.contains("admin-bar")) {
    const event = new CustomEvent(PAGE_ENTER, {
      bubbles: true,
      detail: {
        container: document,
      },
    });
    document.dispatchEvent(event);

    document.addEventListener("redirect", (event: CustomEvent) => {
      const href = event.detail.href;
      if (href) {
        window.location.href = href;
      }
    });
  }
});

window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});
