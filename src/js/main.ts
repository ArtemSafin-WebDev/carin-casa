import "virtual:svg-icons-register";

import hoverCards from "./hoverCards";
import detailSlider from "./detailSlider";
import featureShowMore from "./feature";
import menu from "./menu";
import intro from "./intro";
import smoothScrolling from "./smoothScrolling";
import homeAnimations from "./homeAnimations";
import reveal from "./reveal";
import catalogFilters from "./catalogFilters";
import forms from "./forms";
import videos from "./videos";
import mapScrolling from "./mapScrolling";
import "../css/style.css";

document.addEventListener("DOMContentLoaded", () => {
  smoothScrolling();
  hoverCards();
  detailSlider();
  featureShowMore();
  intro();
  menu();
  homeAnimations();
  reveal();
  catalogFilters();
  forms();
  videos();
  mapScrolling();
});

window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});
