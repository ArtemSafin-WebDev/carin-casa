import { clearAllBodyScrollLocks, disableBodyScroll } from "body-scroll-lock";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { isMobile } from "./utils";
import { Flip } from "gsap/Flip";
import { PAGE_ENTER } from "./constants/pageEnter";
import { PAGE_LEAVE } from "./constants/pageLeave";

gsap.registerPlugin(ScrollTrigger, Flip);

interface Accordion {
  element: HTMLElement;
  handler: (event: MouseEvent) => void;
}

interface Select {
  inputs: HTMLInputElement[];
  setSelected: () => void;
  form: HTMLFormElement;
  formResetHandler: () => void;
  btn: HTMLButtonElement;
  buttonHandler: (event: MouseEvent) => void;
  outsideClickHandler: (event: MouseEvent) => void;
}

export default function catalogFilters() {
  let instances = [];

  function initialize(context = document) {
    if (instances.length) return;
    const elements: HTMLElement[] = Array.from(
      context.querySelectorAll(".js-catalog-filters")
    );

    elements.forEach((element) => {
      let filtersOpen = false;
      const accordions = Array.from(
        element.querySelectorAll<HTMLDivElement>(".catalog__filters-accordion")
      );
      const selects = Array.from(
        element.querySelectorAll<HTMLDivElement>(".catalog__filters-select")
      );
      const filtersModal = element.querySelector<HTMLDivElement>(
        ".catalog__filters-modal"
      );

      const filtersOpenBtn = element.querySelector<HTMLButtonElement>(
        ".catalog__filters-open-btn"
      );
      const filtersCloseBtn = element.querySelector<HTMLButtonElement>(
        ".catalog__filters-modal-close"
      );

      const mobileSubmit = element.querySelector<HTMLButtonElement>(
        ".catalog__filters-mobile-submit"
      );

      const mobileReset = element.querySelector<HTMLButtonElement>(
        ".catalog__filters-mobile-reset"
      );

      const range = element.querySelector<HTMLDivElement>(
        ".catalog__filters-range"
      );

      const form = element.querySelector("form");

      const checkboxes: HTMLInputElement[] = Array.from(
        element.querySelectorAll(".catalog__filters-checkbox-input")
      );

      const slider = range.querySelector<HTMLElement>(
        ".catalog__filters-range-slider"
      );
      const minus = range.querySelector(".catalog__filters-range-btn--minus");
      const plus = range.querySelector(".catalog__filters-range-btn--plus");
      let dragging = false;

      let showOnDesktop = 1;
      let showOnMobile = 1;

      if (window.localStorage.getItem("showOnDesktop")) {
        showOnDesktop = Number(window.localStorage.getItem("showOnDesktop"));
      }
      if (window.localStorage.getItem("showOnMobile")) {
        showOnMobile = Number(window.localStorage.getItem("showOnMobile"));
      }

      const setDesktopProgress = (amount: number) => {
        let state = null;

        if (!isMobile()) {
          state = Flip.getState(".catalog__results-list-item");
        }

        document.body.classList.remove("show-four-columns");
        document.body.classList.remove("show-three-columns");
        document.body.classList.remove("show-two-columns");
        document.body.classList.remove("show-one-column");
        if (amount === 1) {
          slider.style.setProperty("--desktop-progress", "0");
          showOnDesktop = 1;
          document.body.classList.add("show-four-columns");

          window.localStorage.setItem("showOnDesktop", "1");
        } else if (amount === 2) {
          slider.style.setProperty("--desktop-progress", "0.33");
          showOnDesktop = 2;
          document.body.classList.add("show-three-columns");

          window.localStorage.setItem("showOnDesktop", "2");
        } else if (amount === 3) {
          slider.style.setProperty("--desktop-progress", "0.66");
          showOnDesktop = 3;
          document.body.classList.add("show-two-columns");

          window.localStorage.setItem("showOnDesktop", "3");
        } else if (amount === 4) {
          slider.style.setProperty("--desktop-progress", "1");
          showOnDesktop = 4;
          document.body.classList.add("show-one-column");

          window.localStorage.setItem("showOnDesktop", "4");
        }

        if (!isMobile()) {
          ScrollTrigger.refresh();
          Flip.from(state, {
            ease: "power1.inOut",
            duration: 0.4,
          });
        }
      };

      const setMobileProgress = (amount: number) => {
        let state = null;

        if (isMobile()) {
          state = Flip.getState(".catalog__results-list-item");
        }
        document.body.classList.remove("mobile-show-two-columns");
        document.body.classList.remove("mobile-show-one-column");
        if (amount === 1) {
          slider.style.setProperty("--mobile-progress", "0");
          document.body.classList.add("mobile-show-two-columns");
          showOnMobile = 1;

          window.localStorage.setItem("showOnMobile", "1");
        } else if (amount === 2) {
          slider.style.setProperty("--mobile-progress", "1");
          document.body.classList.add("mobile-show-one-column");
          showOnMobile = 2;

          window.localStorage.setItem("showOnMobile", "2");
        }

        if (isMobile()) {
          ScrollTrigger.refresh();
          Flip.from(state, {
            ease: "power1.inOut",
            duration: 0.4,
          });
        }
      };

      setDesktopProgress(showOnDesktop);

      const handleMouseMove = (event: MouseEvent) => {
        if (!dragging) return;
        const x = event.offsetX;
        const width = slider.offsetWidth;

        const progress = x / width;

        if (progress >= 0 && progress < 0.25) {
          if (showOnDesktop !== 1) {
            setDesktopProgress(1);
          }
        } else if (progress >= 0.25 && progress < 0.5) {
          if (showOnDesktop !== 2) {
            setDesktopProgress(2);
          }
        } else if (progress >= 0.5 && progress < 0.75) {
          if (showOnDesktop !== 3) {
            setDesktopProgress(3);
          }
        } else if (progress >= 0.75 && progress <= 1) {
          if (showOnDesktop !== 4) {
            setDesktopProgress(4);
          }
        }

        if (progress >= 0 && progress < 0.5) {
          if (showOnMobile !== 1) {
            setMobileProgress(1);
          }
        } else if (progress >= 0.5 && progress <= 1) {
          if (showOnMobile !== 2) {
            setMobileProgress(2);
          }
        }
      };

      const handlePointerDown = () => {
        dragging = true;
      };
      const handlePointerUp = () => {
        dragging = false;
      };

      const handlePlusClick = (event) => {
        event.preventDefault();
        if (showOnDesktop < 4) {
          showOnDesktop = ++showOnDesktop;
          setDesktopProgress(showOnDesktop);
        }

        if (showOnMobile < 2) {
          showOnMobile = ++showOnMobile;
          setMobileProgress(showOnMobile);
        }
      };

      const handleMinusClick = (event) => {
        event.preventDefault();
        if (showOnDesktop > 1) {
          showOnDesktop = --showOnDesktop;
          setDesktopProgress(showOnDesktop);
        }

        if (showOnMobile > 1) {
          showOnMobile = --showOnMobile;
          setMobileProgress(showOnMobile);
        }
      };

      slider.addEventListener("pointerenter", handlePointerUp);
      slider.addEventListener("pointerdown", handlePointerDown);
      slider.addEventListener("pointermove", handleMouseMove);
      slider.addEventListener("pointerup", handlePointerUp);
      slider.addEventListener("pointercancel", handlePointerUp);
      slider.addEventListener("pointerleave", handlePointerUp);
      plus.addEventListener("click", handlePlusClick);
      minus.addEventListener("click", handleMinusClick);

      const checkForm = () => {
        const data = new FormData(form);

        let entries = [];

        for (const pair of data.entries()) {
          const key = pair[0] as string;
          const value = pair[1] as string;

          if (key === "product-category") continue;
          if (value.trim() !== "") {
            entries.push({
              [key]: value,
            });
          }
        }

        if (entries.length) {
          form.classList.add("filters-applied");
        } else {
          form.classList.remove("filters-applied");
        }
      };

      checkForm();

      const openFilters = () => {
        if (filtersOpen) return;
        filtersModal.classList.add("active");
        disableBodyScroll(filtersModal);
        filtersOpen = true;
      };

      const closeFilters = () => {
        if (!filtersOpen) return;
        filtersModal.classList.remove("active");
        clearAllBodyScrollLocks();
        filtersOpen = false;
      };

      const openAccordion = (element) => {
        const state = Flip.getState([element]);
        element.parentElement.classList.add("active");

        Flip.from(state, {
          ease: "power1.inOut",
          duration: 0.4,
        });
      };
      const closeAccordion = (element) => {
        const state = Flip.getState([element]);
        element.parentElement.classList.remove("active");

        Flip.from(state, {
          ease: "power1.inOut",
          duration: 0.4,
        });
      };

      filtersOpenBtn.addEventListener("click", openFilters);

      filtersCloseBtn.addEventListener("click", closeFilters);

      mobileSubmit.addEventListener("click", closeFilters);

      mobileReset.addEventListener("click", closeFilters);

      let accordionsInstances: Accordion[] = [];

      function initAccordions() {
        accordions.forEach((accordion) => {
          const btn = accordion.querySelector<HTMLButtonElement>(
            ".catalog__filters-accordion-btn"
          );
          const content = accordion.querySelector<HTMLDivElement>(
            ".catalog__filters-accordion-content"
          );

          const handler = (event: MouseEvent) => {
            event.preventDefault();
            if (accordion.classList.contains("active")) {
              closeAccordion(content);
            } else {
              openAccordion(content);
            }
          };

          btn.addEventListener("click", handler);

          accordionsInstances.push({
            element: accordion,
            handler,
          });
        });
      }

      function destroyAccordions() {
        accordionsInstances.forEach((instance) => {
          const { element, handler } = instance;
          element.removeEventListener("click", handler);
        });
        accordionsInstances = [];
      }

      initAccordions();

      let selectsInstances: Select[] = [];

      function initializeSelects() {
        selects.forEach((select) => {
          const form = select.closest("form");
          const btn = select.querySelector<HTMLButtonElement>(
            ".catalog__filters-select-btn"
          );
          const btnText = select.querySelector<HTMLElement>(
            ".catalog__filters-select-btn-text"
          );

          let open = false;
          const openSelect = () => {
            select.classList.add("open");
            open = true;
          };
          const closeSelect = () => {
            select.classList.remove("open");
            open = false;
          };

          const inputs = Array.from(
            select.querySelectorAll<HTMLInputElement>('input[type="radio"]')
          );

          const setPlaceholderValue = () => {
            select.classList.add("placeholder-shown");
            const placeholderItem = inputs.find(
              (input) => input.value?.trim() === ""
            );
            if (!placeholderItem) return;
            const itemTextElement = placeholderItem.nextElementSibling;
            if (!itemTextElement) return;

            btnText.textContent = itemTextElement.textContent;
          };

          const setSelected = () => {
            select.classList.remove("placeholder-shown");
            const selected = inputs.find((input) => input.checked);
            if (!selected || selected.value.trim() === "") {
              setPlaceholderValue();
            } else {
              const itemTextElement = selected.nextElementSibling;
              if (!itemTextElement) return;
              btnText.textContent = itemTextElement.textContent;
            }
            closeSelect();
            checkForm();
          };

          const buttonHandler = (event: MouseEvent) => {
            event.preventDefault();
            if (!open) {
              openSelect();
            } else {
              closeSelect();
            }
          };

          btn.addEventListener("click", buttonHandler);

          inputs.forEach((input) => {
            input.addEventListener("change", setSelected);
          });

          const outsideClickHandler = (event: MouseEvent) => {
            const target = event.target as HTMLElement;

            if (select.contains(target)) return;
            closeSelect();
          };

          document.addEventListener("click", outsideClickHandler);

          const formResetHandler = () => {
            inputs.forEach((input) => (input.checked = false));
            checkboxes.forEach((box) => (box.checked = false));
            setSelected();
            closeSelect();
            checkForm();
          };

          form.addEventListener("reset", formResetHandler);

          const selected = inputs.find((input) => input.checked);
          if (!selected) {
            const empty = inputs.find((input) => input.value.trim() === "");
            if (empty) {
              empty.checked = true;
            }
          }
          setSelected();

          selectsInstances.push({
            inputs,
            setSelected,
            form,
            formResetHandler,
            btn,
            buttonHandler,
            outsideClickHandler,
          });
        });
      }

      function destroySelects() {
        selectsInstances.forEach((instance) => {
          const {
            inputs,
            setSelected,
            form,
            formResetHandler,
            btn,
            buttonHandler,
            outsideClickHandler,
          } = instance;

          inputs.forEach((input) =>
            input.removeEventListener("change", setSelected)
          );

          form.removeEventListener("reset", formResetHandler);

          btn.removeEventListener("click", buttonHandler);

          document.removeEventListener("click", outsideClickHandler);

          checkForm();
        });
        selectsInstances = [];
      }

      initializeSelects();

      const reinitFiltersHandler = () => {
        destroyAccordions();
        destroySelects();
        initAccordions();
        initializeSelects();
      };

      document.addEventListener("reinitfilters", reinitFiltersHandler);

      instances.push({
        reinitFiltersHandler,
        destroySelects,
        destroyAccordions,
        slider,
        handlePointerDown,
        handlePointerUp,
        handleMinusClick,
        handlePlusClick,
        handleMouseMove,
        minus,
        plus,
        openFilters,
        closeFilters,
        filtersOpenBtn,
        filtersCloseBtn,
        mobileSubmit,
        mobileReset,
      });
    });
  }

  function destroy() {
    // document.body.classList.remove("show-four-columns");
    // document.body.classList.remove("show-three-columns");
    // document.body.classList.remove("show-two-columns");
    // document.body.classList.remove("show-one-column");
    // document.body.classList.remove("mobile-show-two-columns");
    // document.body.classList.remove("mobile-show-one-column");

    instances.forEach((instance) => {
      const {
        reinitFiltersHandler,
        destroySelects,
        destroyAccordions,
        slider,
        plus,
        minus,
        handlePointerUp,
        handlePointerDown,
        handlePlusClick,
        handleMinusClick,
        handleMouseMove,
        filtersOpenBtn,
        filtersCloseBtn,
        mobileSubmit,
        mobileReset,
        openFilters,
        closeFilters,
      } = instance;

      closeFilters();

      document.removeEventListener("reinitfilters", reinitFiltersHandler);

      destroySelects();
      destroyAccordions();

      slider.removeEventListener("pointerenter", handlePointerUp);
      slider.removeEventListener("pointerdown", handlePointerDown);
      slider.removeEventListener("pointermove", handleMouseMove);
      slider.removeEventListener("pointerup", handlePointerUp);
      slider.removeEventListener("pointercancel", handlePointerUp);
      slider.removeEventListener("pointerleave", handlePointerUp);
      plus.removeEventListener("click", handlePlusClick);
      minus.removeEventListener("click", handleMinusClick);

      filtersOpenBtn.removeEventListener("click", openFilters);
      filtersCloseBtn.removeEventListener("click", closeFilters);
      mobileSubmit.removeEventListener("click", closeFilters);
      mobileReset.removeEventListener("click", closeFilters);
    });

    instances = [];
  }

  document.addEventListener(PAGE_LEAVE, () => {
    destroy();
  });

  document.addEventListener(PAGE_ENTER, (event: CustomEvent) => {
    initialize(event.detail.container);
  });
}
