import { clearAllBodyScrollLocks, disableBodyScroll } from "body-scroll-lock";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function menu() {
  const burger = document.querySelector<HTMLButtonElement>(
    ".page-header__burger"
  );
  const menu = document.querySelector<HTMLDivElement>(".page-header__menu");
  let menuOpen = false;
  const SPEED = 0.3;

  if (!menu) return;

  const menuItems = Array.from(
    document.querySelectorAll<HTMLUListElement>(".page-header__nav-list-item")
  );

  const openMenu = () => {
    if (menuOpen) return;
    document.documentElement.classList.add("menu-open");
    disableBodyScroll(menu);
    menuOpen = true;
  };

  const closeMenu = () => {
    if (!menuOpen) return;
    document.documentElement.classList.remove("menu-open");
    clearAllBodyScrollLocks();
    menuOpen = false;
  };

  const openAccordion = (element: HTMLElement) => {
    gsap.to(element, {
      height: "auto",
      duration: SPEED,
      onComplete: () => ScrollTrigger.refresh(),
    });
  };
  const closeAccordion = (element: HTMLElement) => {
    gsap.to(element, {
      height: 0,
      duration: SPEED,
      onComplete: () => ScrollTrigger.refresh(),
    });
  };

  burger?.addEventListener("click", (event) => {
    event.preventDefault();
    if (menuOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  menuItems.forEach((item) => {
    item.addEventListener("mouseenter", () => {
      document.body.classList.add("menu-hovered");
      item.classList.add("hovered");
      if (item.matches(".page-header__nav-list-item--has-submenu")) {
        document.body.classList.add("submenu-open");
        item.classList.add("show-submenu");
      }
    });

    item.addEventListener("mouseleave", () => {
      document.body.classList.remove("menu-hovered");
      item.classList.remove("hovered");
      if (item.matches(".page-header__nav-list-item--has-submenu")) {
        document.body.classList.remove("submenu-open");
        item.classList.remove("show-submenu");
      }
    });
  });

  const itemsWithSubmenu = Array.from(
    document.querySelectorAll(".page-header__nav-list-item--has-submenu")
  );

  itemsWithSubmenu.forEach((item) => {
    const btn = item.querySelector<HTMLLinkElement>(".page-header__nav-link");
    const content = item.querySelector<HTMLElement>(".page-header__submenu");
    const links = Array.from(
      item.querySelectorAll<HTMLLinkElement>(".page-header__submenu-link")
    );

    const blocks = Array.from(
      item.querySelectorAll(".page-header__submenu-products-block")
    );

    const setActiveBlock = (index: number) => {
      links.forEach((link) => link.classList.remove("active"));
      links[index]?.classList.add("active");
      blocks.forEach((block) => block.classList.remove("active"));
      blocks[index]?.classList.add("active");
    };

    if (blocks.length) {
      setActiveBlock(0);
    }

    links.forEach((link, linkIndex) => {
      link.addEventListener("mouseenter", () => {
        setActiveBlock(linkIndex);
      });
    });

    if (content) {
      btn?.addEventListener("click", (event) => {
        if (!window.matchMedia("(max-width: 640px)").matches) return;
        event.preventDefault();
        if (btn.classList.contains("open")) {
          closeAccordion(content);
        } else {
          openAccordion(content);
        }
        btn.classList.toggle("open");
      });
    }
  });
}
