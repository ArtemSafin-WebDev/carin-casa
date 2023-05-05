import { clearAllBodyScrollLocks, disableBodyScroll } from "body-scroll-lock";
import Validator from "./Validator";
import axios from "axios";

class ProductModal {
  private closeBtns: HTMLButtonElement[];
  private open: boolean = false;
  private modal: HTMLElement;
  private openBtn: HTMLButtonElement;
  private form: HTMLFormElement;
  private formValidator: Validator;
  private resetLayersBtns: HTMLButtonElement[];
  private standardLayer: HTMLElement;
  private successLayer: HTMLElement;
  private errorLayer: HTMLElement;
  private controller: AbortController;
  private successSubmitCallback: () => void;
  constructor(
    element: HTMLElement,
    openBtn: HTMLButtonElement,
    successSubmitCallback?: () => void
  ) {
    this.modal = element;
    this.closeBtns = Array.from(
      element.querySelectorAll(".js-product-modal-close")
    );

    this.standardLayer = element.querySelector(
      ".product-modal__standard-layer"
    );

    this.successLayer = element.querySelector(".product-modal__success-layer");

    this.errorLayer = element.querySelector(".product-modal__error-layer");

    this.resetLayersBtns = Array.from(
      element.querySelectorAll(".js-product-modal-reset-layers")
    );
    this.openBtn = openBtn;
    this.form = element.querySelector("form");
    this.closeBtns.forEach((btn) => {
      btn.addEventListener("click", this.handleClose);
    });

    if (this.openBtn) {
      this.openBtn.addEventListener("click", this.handleOpen);
    }

    if (successSubmitCallback) {
      this.successSubmitCallback = successSubmitCallback;
    }

    if (this.form) {
      this.controller = new AbortController();
      this.formValidator = new Validator(this.form);
      this.form.addEventListener("submit", this.handleFormSubmit);

      console.log("Validator attached");
    }

    this.modal.addEventListener("click", this.handleOutsideModalClick);

    this.resetLayersBtns.forEach((btn) => {
      btn.addEventListener("click", this.resetLayers);
    });
  }

  private handleOutsideModalClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target === this.modal) {
      this.closeModal();
    }
  };

  public resetLayers = () => {
    this.standardLayer.classList.remove("hidden");
    this.errorLayer.classList.remove("shown");
    this.successLayer.classList.remove("shown");
  };

  public showSuccess = () => {
    this.standardLayer.classList.add("hidden");
    this.errorLayer.classList.remove("shown");
    this.successLayer.classList.add("shown");
  };

  public showError = () => {
    this.standardLayer.classList.add("hidden");
    this.errorLayer.classList.add("shown");
    this.successLayer.classList.remove("shown");
  };

  private handleFormSubmit = (event: SubmitEvent) => {
    console.log("Submitting form inside modal");
    event.preventDefault();
    this.formValidator.validate();

    if (this.formValidator.valid) {
      const formData = new FormData(this.form);

      axios
        .post(this.form.action, formData, {
          signal: this.controller.signal,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          console.log(res.data);
          if (res.data.status === "mail_sent") {
            this.form.reset();
            this.showSuccess();

            if (typeof this.successSubmitCallback === "function") {
              this.successSubmitCallback();
            }
          }
        })
        .catch(() => {
          this.showError();
        });
    }
  };

  private handleClose = (event: MouseEvent) => {
    event.preventDefault();
    this.closeModal();
  };

  private handleOpen = (event: MouseEvent) => {
    event.preventDefault();
    this.openModal();
  };

  public openModal() {
    if (this.open) return;
    disableBodyScroll(this.modal, {
      reserveScrollBarGap: true,
    });
    this.modal.classList.add("active");
    this.open = true;
  }

  public closeModal() {
    if (!this.open) return;
    clearAllBodyScrollLocks();
    this.modal.classList.remove("active");
    this.open = false;
    this.form.reset();
    this.resetLayers();
  }

  public destroy() {
    this.closeModal();
    if (this.openBtn) {
      this.openBtn.removeEventListener("click", this.handleOpen);
    }

    this.closeBtns.forEach((btn) => {
      btn.removeEventListener("click", this.handleClose);
    });
    if (this.form) {
      this.form.removeEventListener("submit", this.handleFormSubmit);
      this.formValidator.destroy();

      console.log("Validator removed");
    }

    this.modal.removeEventListener("click", this.handleOutsideModalClick);

    this.resetLayersBtns.forEach((btn) => {
      btn.removeEventListener("click", this.resetLayers);
    });
  }
}

export default ProductModal;
