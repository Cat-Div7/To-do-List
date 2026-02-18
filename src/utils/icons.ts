// Helper to create <i> elements with given classes
export function createIcon(classes: readonly string[]): HTMLElement {
  const icon = document.createElement("i");
  icon.classList.add(...classes);
  return icon;
}

export const checkIcon = (): HTMLElement =>
  createIcon(["fas", "fa-check-circle"]);
export const trashIcon = (): HTMLElement =>
  createIcon(["fas", "fa-times-circle"]);
