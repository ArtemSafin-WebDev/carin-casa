import "virtual:svg-icons-register";

import hoverCards from "./hoverCards";
import detailSlider from "./detailSlider";
import featureShowMore from "./feature";
import menu from "./menu";
import intro from "./intro";
import smoothScrolling from "./smoothScrolling";
import introParallax from "./introParallax";
import reveal from "./reveal";
import catalogFilters from "./catalogFilters";
import forms from "./forms";
import videos from "./videos";
import mapScrolling from "./mapScrolling";
import pageTransitions from "./pageTransitions";

import "../css/style.css";
import contactsParallax from "./contactsParallax";
import contactsIntroAnimation from "./contactsIntroAnimation";
import catalogIntroAnimation from "./catalogIntroAnimation";
import introMobileSlider from "./introMobileSlider";

document.addEventListener("DOMContentLoaded", () => {
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
  contactsIntroAnimation();
  catalogIntroAnimation();
  introMobileSlider();
});

window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});
