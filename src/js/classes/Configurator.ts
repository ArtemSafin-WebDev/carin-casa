import { gsap } from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import ProductModal from "./ProductModal";

gsap.registerPlugin(ScrollTrigger);

class Configurator {
  private imageWrapper: HTMLElement;

  private sizesBtns: HTMLButtonElement[];
  private materialsBtns: HTMLButtonElement[];
  private facadeBtns: HTMLButtonElement[];
  private optionsBtns: HTMLButtonElement[];
  private priceOutput: HTMLElement;
  private projectAboutIntro: HTMLElement;
  private materialModalOpenBtn: HTMLButtonElement;
  private materialModal: HTMLElement;
  private materialModalInstance: ProductModal | null;
  private modelModal: HTMLElement;
  private modelModalOpenBtn: HTMLButtonElement;
  private modelModalInstance: ProductModal | null;
  private mm: gsap.MatchMedia;
  constructor(element: HTMLElement) {
    this.imageWrapper = element.querySelector(
      ".product__about-sticky-image-wrapper"
    );

    this.sizesBtns = Array.from(
      element.querySelectorAll<HTMLButtonElement>(
        ".product__about-configurator-checkboxes-block--size .product__about-configurator-checkbox-btn"
      )
    );

    this.materialsBtns = Array.from(
      element.querySelectorAll<HTMLButtonElement>(
        ".product__about-configurator-checkboxes-block--materials .product__about-configurator-checkbox-btn"
      )
    );
    this.facadeBtns = Array.from(
      element.querySelectorAll<HTMLButtonElement>(
        ".product__about-configurator-checkboxes-block--facade .product__about-configurator-checkbox-btn"
      )
    );
    this.optionsBtns = Array.from(
      element.querySelectorAll<HTMLButtonElement>(
        ".product__about-configurator-options-block .product__about-configurator-options-btn"
      )
    );

    this.projectAboutIntro = element.querySelector(".product__about-intro");

    this.priceOutput = element.querySelector(
      ".product__about-configurator-price-amount"
    );

    this.materialModalOpenBtn = element.querySelector(
      ".product__about-btn.product__about-btn--filled"
    );

    this.materialModal = document.querySelector(".js-material-modal-2");

    console.log("Modal data", this.materialModal, this.materialModalOpenBtn);

    if (this.materialModal && this.materialModalOpenBtn) {
      this.materialModalInstance = new ProductModal(
        this.materialModal,
        this.materialModalOpenBtn
      );
    }

    this.modelModal = document.querySelector(".js-model-modal-2");

    this.modelModalOpenBtn = element.querySelector(
      ".product__about-btn:not(.product__about-btn--filled)"
    );

    if (this.modelModal && this.modelModalOpenBtn) {
      this.modelModalInstance = new ProductModal(
        this.modelModal,
        this.modelModalOpenBtn
      );
    }

    this.mm = gsap.matchMedia();

    console.log({
      sizesBtns: this.sizesBtns.length,
      materialsBtns: this.materialsBtns.length,
      optionsBtns: this.optionsBtns.length,
    });

    this.pinImage();
    this.setSizeSelect();
    this.setMaterialSelect();
    this.setFacadeSelect();

    this.setOptionsSelect();

    this.calculatePrice();
  }

  private pinImage() {
    this.mm.add("(min-width: 641px)", () => {
      ScrollTrigger.create({
        trigger: this.imageWrapper,
        start: "top top",
        markers: false,
        pin: true,
        pinSpacing: false,
        end: () => {
          const value =
            this.projectAboutIntro.offsetHeight -
            (this.imageWrapper.getBoundingClientRect().top +
              window.pageYOffset -
              (this.projectAboutIntro.getBoundingClientRect().top +
                window.pageYOffset)) -
            this.imageWrapper.offsetHeight;

          return `+=${value}`;
        },
      });
    });
  }

  private setSizeSelect() {
    this.sizesBtns.forEach((btn) => {
      const handler = (event: MouseEvent) => {
        event.preventDefault();
        this.sizesBtns.forEach((btn) => btn.classList.remove("active"));
        btn.classList.add("active");

        console.log("Clicked on btn", btn);

        if (btn.hasAttribute("data-materials-prices")) {
          const prices = btn.getAttribute("data-materials-prices").split(",");
          for (const [priceIndex, price] of prices.entries()) {
            if (price.toLowerCase().trim() === "skip") continue;
            const relatedBtn = this.materialsBtns[priceIndex];
            if (!relatedBtn) {
              continue;
            }
            relatedBtn.setAttribute("data-price", price);
            const text = relatedBtn.querySelector(
              ".product__about-configurator-checkbox-btn-price"
            );
            text.textContent = `+${Number(price).toLocaleString()} ₽`;
          }
        }

        if (btn.hasAttribute("data-options-prices")) {
          const prices = btn.getAttribute("data-options-prices").split(",");
          for (const [priceIndex, price] of prices.entries()) {
            if (price.toLowerCase().trim() === "skip") continue;
            const relatedBtn = this.optionsBtns[priceIndex];
            if (!relatedBtn) continue;
            relatedBtn.setAttribute("data-price", price);
            const text = relatedBtn.querySelector(
              ".product__about-configurator-options-btn-price"
            );
            text.textContent = `+${Number(price).toLocaleString()} ₽`;
          }
        }

        this.calculatePrice();
      };
      btn.addEventListener("click", handler);
    });

    if (this.sizesBtns.length) {
      const activeBtn = this.sizesBtns.find((btn) =>
        btn.classList.contains("active")
      );

      console.log("Active sizes btn", activeBtn);
      if (!activeBtn) {
        this.sizesBtns[0].click();
      } else {
        activeBtn.click();
      }
    }
  }

  private setMaterialSelect() {
    this.materialsBtns.forEach((btn) => {
      const handler = (event: MouseEvent) => {
        event.preventDefault();
        this.materialsBtns.forEach((btn) => btn.classList.remove("active"));
        btn.classList.add("active");

        this.calculatePrice();
      };
      btn.addEventListener("click", handler);
    });

    if (this.materialsBtns.length) {
      const activeBtn = this.materialsBtns.find((btn) =>
        btn.classList.contains("active")
      );
      if (!activeBtn) {
        this.materialsBtns[0].click();
      } else {
        activeBtn.click();
      }
    }
  }

  private setFacadeSelect() {
    this.facadeBtns.forEach((btn) => {
      const handler = (event: MouseEvent) => {
        event.preventDefault();
        this.facadeBtns.forEach((btn) => btn.classList.remove("active"));
        btn.classList.add("active");

        this.calculatePrice();
      };
      btn.addEventListener("click", handler);
    });

    if (this.facadeBtns.length) {
      const activeBtn = this.facadeBtns.find((btn) =>
        btn.classList.contains("active")
      );
      if (!activeBtn) {
        this.facadeBtns[0].click();
      } else {
        activeBtn.click();
      }
    }
  }

  private setOptionsSelect() {
    this.optionsBtns.forEach((btn) => {
      const handler = (event: MouseEvent) => {
        event.preventDefault();

        btn.classList.toggle("active");

        this.calculatePrice();
      };
      btn.addEventListener("click", handler);
    });
  }

  private calculatePrice() {
    let sizePrice = 0;
    let materialPrice = 0;
    let optionsPrice = 0;
    let facadePrice = 0;

    console.log(this.sizesBtns, this.materialsBtns, this.optionsBtns);

    if (this.sizesBtns.length) {
      const activeBtn = this.sizesBtns.find((btn) =>
        btn.classList.contains("active")
      );
      if (activeBtn) {
        const price = Number(activeBtn.getAttribute("data-price"));
        sizePrice = price;
      }
    }
    if (this.materialsBtns.length) {
      const activeBtn = this.materialsBtns.find((btn) =>
        btn.classList.contains("active")
      );
      if (activeBtn) {
        const price = Number(activeBtn.getAttribute("data-price"));
        materialPrice = price;
      }
    }

    if (this.facadeBtns.length) {
      const activeBtn = this.facadeBtns.find((btn) =>
        btn.classList.contains("active")
      );
      if (activeBtn) {
        const price = Number(activeBtn.getAttribute("data-price"));
        facadePrice = price;
      }
    }

    if (this.optionsBtns.length) {
      const activeBtns = this.optionsBtns.filter((btn) =>
        btn.classList.contains("active")
      );
      if (activeBtns.length) {
        activeBtns.forEach((activeBtn) => {
          const price = Number(activeBtn.getAttribute("data-price"));
          optionsPrice += price;
        });
      }
    }

    const total = sizePrice + materialPrice + optionsPrice + facadePrice;

    this.priceOutput.textContent = `${total.toLocaleString()} ₽`;
  }

  public destroy() {
    if (this.mm) {
      this.mm.revert();
      this.mm.kill();
    }

    if (this.materialModalInstance) {
      this.materialModalInstance.destroy();
    }

    if (this.modelModalInstance) {
      this.modelModalInstance.destroy();
    }
  }
}

export default Configurator;
