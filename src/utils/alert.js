export function showAlert(DOM, message) {
  DOM.alert.classList.add("d-block");
  DOM.inputContainer.classList.add("ally-active");
  DOM.alert.textContent = message;
}

export function hideAlert(DOM) {
  DOM.alert.classList.remove("d-block");
  DOM.inputContainer.classList.remove("ally-active");
}
