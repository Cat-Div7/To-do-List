import type { AppDOM } from "../types";

export function showAlert(DOM: AppDOM, message: string): void {
  DOM.alert.classList.add("d-block");
  DOM.inputContainer.classList.add("ally-active");
  DOM.alert.textContent = message;
}

export function hideAlert(DOM: AppDOM): void {
  DOM.alert.classList.remove("d-block");
  DOM.inputContainer.classList.remove("ally-active");
}
