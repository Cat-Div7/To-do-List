// Helper to create <i> elements with given classes
export function createIcon(classes) {
  const icon = document.createElement("i");
  classes.forEach((cls) => icon.classList.add(cls));
  return icon;
}

export const checkIcon = () => createIcon(["fas", "fa-check-circle"]);
export const trashIcon = () => createIcon(["fas", "fa-times-circle"]);
