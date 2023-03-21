import { gsap } from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Flip from "gsap/Flip";
import Swiper from "swiper";
import "swiper/css";
import ProductModal from "./ProductModal";

gsap.registerPlugin(ScrollTrigger, Flip);

export class MaterialConfigurator {
  private partsBtns: HTMLButtonElement[];
  private partsItems: HTMLDivElement[];
  private partsItemsContainer: HTMLDivElement;
  private partsBtnsInstances: Array<{
    btn: HTMLButtonElement;
    handler: (event: MouseEvent) => void;
  }> = [];

  private formsSliderContainer: HTMLElement | null;
  private formsSliderInstance: Swiper | null;
  private formCards: HTMLElement[];
  private formPreview: HTMLElement | null;
  private mainMaterialIllustration: HTMLImageElement | null;
  private selectedMaterialsCards: HTMLElement[];
  private matInputs: HTMLInputElement[];
  private materialModalOpenBtn: HTMLButtonElement;
  private materialModal: HTMLElement;
  private materialModalInstance: ProductModal | null;
  private modelModal: HTMLElement;
  private modelModalOpenBtn: HTMLButtonElement;
  private modelModalInstance: ProductModal | null;
  private categorySliders: HTMLElement[];
  private categorySlidersInstances: Array<Swiper | null> = [];
  private mql: MediaQueryList;
  constructor(element: HTMLElement) {
    this.partsBtns = Array.from(
      element.querySelectorAll(".product__materials-choose-part-btn")
    );
    this.partsItems = Array.from(
      element.querySelectorAll(".product__materials-choose-part-tabs-item")
    );

    this.partsItemsContainer = element.querySelector(
      ".product__materials-choose-part-tabs"
    );

    this.formsSliderContainer = element.querySelector(
      ".product__materials-calc-form-slider .swiper"
    );

    this.formCards = Array.from(
      element.querySelectorAll(".product__materials-calc-form-slider-card")
    );

    this.formPreview = element.querySelector(
      ".product__materials-illustration-material-preview"
    );

    this.mainMaterialIllustration = element.querySelector(
      ".product__materials-illustration-material-preview-image"
    );

    this.selectedMaterialsCards = Array.from(
      element.querySelectorAll(".product__materials-selected-card")
    );

    this.matInputs = Array.from(
      document.querySelectorAll(".product-modal__mat-input")
    );

    this.categorySliders = Array.from(
      element.querySelectorAll(".product__materials-category-slider")
    );

    this.mql = window.matchMedia("(max-width: 640px)");

    this.materialModalOpenBtn = element.querySelector(
      ".product__materials-btn.product__materials-btn--filled"
    );

    this.materialModal = document.querySelector(".js-material-modal");

    if (this.materialModal && this.materialModalOpenBtn) {
      this.materialModalInstance = new ProductModal(
        this.materialModal,
        this.materialModalOpenBtn
      );
    }

    this.modelModal = document.querySelector(".js-model-modal");

    this.modelModalOpenBtn = element.querySelector(
      ".product__materials-btn:not(.product__materials-btn--filled)"
    );

    if (this.modelModal && this.modelModalOpenBtn) {
      this.modelModalInstance = new ProductModal(
        this.modelModal,
        this.modelModalOpenBtn
      );
    }

    this.addPartsBtnsHandlers();
    this.initializeFormSliders();
    this.setFormSelection();
    this.setMaterialSelection();
    this.setMobileCategoriesSliders();

    if (this.partsBtns.length) {
      this.setPart(0);
    }
  }

  private setPart(index: number) {
    const state = Flip.getState(this.partsItemsContainer);

    this.partsBtns.forEach((btn) => btn.classList.remove("active"));
    this.partsItems.forEach((btn) => btn.classList.remove("active"));
    this.partsBtns[index]?.classList.add("active");
    this.partsItems[index]?.classList.add("active");

    Flip.from(state, {
      ease: "power1.inOut",
      duration: 0.4,
      onComplete: () => {
        ScrollTrigger.refresh();
      },
    });
  }

  private setFormSelection() {
    if (this.formPreview && this.formCards.length) {
      this.formCards.forEach((card) => {
        const handler = (event: MouseEvent) => {
          event.preventDefault();
          this.formCards.forEach((card) => card.classList.remove("active"));
          card.classList.add("active");
          const mask = card.getAttribute("data-mask");
          console.log(mask);
          this.formPreview.style.setProperty("--mask-image", `url(${mask})`);
        };
        card.addEventListener("click", handler);
      });

      if (this.formCards.length) {
        this.formCards[0].click();
      }
    }
  }

  private handleWidthChange = (e: MediaQueryListEvent | MediaQueryList) => {
    if (e.matches) {
      this.categorySliders.forEach((slider) => {
        const container: HTMLElement = slider.querySelector(".swiper");
        const instance = new Swiper(container, {
          slidesPerView: "auto",
          speed: 600,
        });

        this.categorySlidersInstances.push(instance);
      });
    } else {
      this.categorySlidersInstances.forEach((instance) => instance.destroy());
      this.categorySlidersInstances = [];
    }
  };

  private setMobileCategoriesSliders() {
    this.mql.addEventListener("change", this.handleWidthChange);
    this.handleWidthChange(this.mql);
  }

  private removeMobileCategoriesSliders() {
    this.mql.removeEventListener("change", this.handleWidthChange);
    this.categorySlidersInstances.forEach((instance) => instance.destroy());
    this.categorySlidersInstances = [];
  }

  private setMaterialSelection() {
    this.partsItems.forEach((item, itemIndex) => {
      const cards: HTMLElement[] = Array.from(
        item.querySelectorAll(".product__materials-card")
      );

      cards.forEach((card) => {
        const handler = (event: MouseEvent) => {
          event.preventDefault();
          cards.forEach((card) => card.classList.remove("active"));
          card.classList.add("active");
          const image = card.querySelector<HTMLImageElement>(
            ".product__materials-card-image"
          );
          const name = card.querySelector(".product__materials-card-title");
          if (itemIndex === 0) {
            if (this.mainMaterialIllustration && image) {
              this.mainMaterialIllustration.src = image.src;
            }
          }

          const selectedMaterialCard = this.selectedMaterialsCards[itemIndex];
          if (selectedMaterialCard) {
            const selectedMaterialCardImage: HTMLImageElement =
              selectedMaterialCard.querySelector(
                ".product__materials-selected-card-image"
              );
            selectedMaterialCardImage.src = image.src;

            const selectedMaterialCardTitle: HTMLElement =
              selectedMaterialCard.querySelector(
                ".product__materials-selected-card-title"
              );

            selectedMaterialCardTitle.textContent = name.textContent;
          }

          const input = this.matInputs[itemIndex];
          if (input && name) {
            input.value = name.textContent.trim();
          }
        };
        card.addEventListener("click", handler);
      });

      if (cards.length) {
        cards[0].click();
      }
    });
  }

  private addPartsBtnsHandlers() {
    this.partsBtns.forEach((btn, btnIndex) => {
      const handler = (event: MouseEvent) => {
        event.preventDefault();
        this.setPart(btnIndex);
      };
      btn.addEventListener("click", handler);
      this.partsBtnsInstances.push({
        btn,
        handler,
      });
    });
  }

  private initializeFormSliders() {
    if (this.formsSliderContainer) {
      this.formsSliderInstance = new Swiper(this.formsSliderContainer, {
        slidesPerView: "auto",
        speed: 600,
        centerInsufficientSlides: true,
      });
    }
  }

  public destroy() {
    this.partsBtnsInstances.forEach((instance) => {
      const { btn, handler } = instance;
      btn.removeEventListener("click", handler);
    });
    this.partsBtnsInstances = [];

    if (this.formsSliderInstance) {
      this.formsSliderInstance.destroy();
    }

    if (this.materialModalInstance) {
      this.materialModalInstance.destroy();
    }

    if (this.modelModalInstance) {
      this.modelModalInstance.destroy();
    }

    this.removeMobileCategoriesSliders();
  }
}

export default MaterialConfigurator;
