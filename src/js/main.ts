import "virtual:svg-icons-register";

import hoverCards from "./hoverCards";
import detailSlider from "./detailSlider";
import featureShowMore from "./feature";
import menu from "./menu";
import intro from "./intro";
import smoothScrolling from "./smoothScrolling";
import homeAnimations from "./homeAnimations";
import "../css/style.css";
import reveal from "./reveal";

document.addEventListener("DOMContentLoaded", () => {
  smoothScrolling();
  hoverCards();
  detailSlider();
  featureShowMore();
  intro();
  menu();
  homeAnimations();
  reveal();
});
