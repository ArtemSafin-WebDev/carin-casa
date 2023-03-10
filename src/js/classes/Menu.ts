import { clearAllBodyScrollLocks, disableBodyScroll } from "body-scroll-lock";
import { gsap } from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Flip from "gsap/Flip";

gsap.registerPlugin(ScrollTrigger, Flip);

export default class Menu {
  private header: HTMLElement;
  private menu: HTMLElement;
  private menuItems: HTMLElement[];
  private burger: HTMLButtonElement;
  private menuOpen: boolean = false;
  private readonly SPEED: number = 0.3;
  private itemsWithHandlers: Array<{
    item: HTMLElement;
    mouseEnterHandler: () => void;
    mouseLeaveHandler: () => void;
  }> = [];
  private itemsWithSubmenu: HTMLElement[] = [];
  private submenuInstances: Array<{
    btn: HTMLButtonElement | HTMLLinkElement;
    btnHandler: (event: MouseEvent) => void;
  }> = [];

  constructor(header: HTMLElement) {
    this.header = header;
    this.menu = this.header.querySelector<HTMLDivElement>(".page-header__menu");
    this.menuItems = Array.from(
      this.header.querySelectorAll<HTMLUListElement>(
        ".page-header__nav-list-item, .page-header__phone"
      )
    );
    this.burger = this.header.querySelector<HTMLButtonElement>(
      ".page-header__burger"
    );

    this.menuItems = Array.from(
      this.header.querySelectorAll<HTMLElement>(
        ".page-header__nav-list-item, .page-header__phone"
      )
    );

    this.itemsWithSubmenu = Array.from(
      this.header.querySelectorAll(".page-header__nav-list-item--has-submenu")
    );

    this.burger?.addEventListener("click", this.handleBurgerClick);
    this.bindMenuItemsHandlers();

    this.bindSubmenuHandlers();
  }

  private handleBurgerClick = (event: MouseEvent) => {
    event.preventDefault();
    if (this.menuOpen) {
      this.close();
    } else {
      this.open();
    }
  };

  private bindMenuItemsHandlers() {
    this.menuItems.forEach((item) => {
      const mouseEnterHandler = this.createItemMouseEnterHandler(item);
      const mouseLeaveHandler = this.createItemMouseLeaveHandler(item);
      item.addEventListener("mouseenter", mouseEnterHandler);
      item.addEventListener("mouseleave", mouseLeaveHandler);

      this.itemsWithHandlers.push({
        item,
        mouseEnterHandler,
        mouseLeaveHandler,
      });
    });
  }

  private openMobileSubmenu = (element: HTMLElement) => {
    gsap.to(element, {
      height: "auto",
      duration: this.SPEED,
      onComplete: () => ScrollTrigger.refresh(),
    });
  };
  private closeMobileSubmenu = (element: HTMLElement) => {
    gsap.to(element, {
      height: 0,
      duration: this.SPEED,
      onComplete: () => ScrollTrigger.refresh(),
    });
  };

  private bindSubmenuHandlers() {
    this.itemsWithSubmenu.forEach((item) => {
      const btn = item.querySelector<HTMLLinkElement>(".page-header__nav-link");
      const content = item.querySelector<HTMLElement>(".page-header__submenu");

      const btnHandler = (event: MouseEvent) => {
        if (!window.matchMedia("(max-width: 640px)").matches) return;
        event.preventDefault();
        event.stopPropagation();
        if (btn.classList.contains("open")) {
          this.closeMobileSubmenu(content);
        } else {
          this.openMobileSubmenu(content);
        }
        btn.classList.toggle("open");
      };

      btn.addEventListener("click", btnHandler);

      this.submenuInstances.push({
        btn,
        btnHandler,
      });
    });
  }

  private removeSubmenuHandlers() {
    this.submenuInstances.forEach((instance) => {
      const { btn, btnHandler } = instance;
      btn.removeEventListener("click", btnHandler);
    });

    this.submenuInstances = [];
  }

  private removeMenuItemsHandlers() {
    this.itemsWithHandlers.forEach((element) => {
      const { item, mouseEnterHandler, mouseLeaveHandler } = element;
      item.removeEventListener("mouseenter", mouseEnterHandler);
      item.removeEventListener("mouseleave", mouseLeaveHandler);
    });
  }

  private createItemMouseEnterHandler = (item: HTMLElement) => {
    return () => {
      document.body.classList.add("menu-hovered");
      item.classList.add("hovered");
      if (item.matches(".page-header__nav-list-item--has-submenu")) {
        document.body.classList.add("submenu-open");
        item.classList.add("show-submenu");
      }
    };
  };

  private createItemMouseLeaveHandler = (item: HTMLElement) => {
    return () => {
      document.body.classList.remove("menu-hovered");
      item.classList.remove("hovered");
      if (item.matches(".page-header__nav-list-item--has-submenu")) {
        document.body.classList.remove("submenu-open");
        item.classList.remove("show-submenu");
      }
    };
  };

  public open() {
    if (this.menuOpen) return;
    document.documentElement.classList.add("menu-open");
    disableBodyScroll(this.menu);
    this.menuOpen = true;
  }

  public close() {
    if (!this.menuOpen) return;
    document.documentElement.classList.remove("menu-open");
    clearAllBodyScrollLocks();
    this.menuOpen = false;
  }

  public destroy() {
    this.close();
    this.burger?.removeEventListener("click", this.handleBurgerClick);
    document.body.classList.remove("menu-hovered");
    document.body.classList.remove("submenu-open");
    this.menuItems.forEach((item) => {
      item.classList.remove("hovered");
      item.classList.remove("show-submenu");
    });
    this.removeMenuItemsHandlers();
    this.removeSubmenuHandlers();
  }
}
