import { checkIcon, trashIcon } from "./icons.js";
import type { Task } from "../types";

export function createTaskElement(task: Task): HTMLLIElement {
  const $li = document.createElement("li");
  const $span = document.createElement("span");
  const $actionsDiv = document.createElement("div");
  const $completeBtn = document.createElement("button");
  const $deleteBtn = document.createElement("button");

  // Structure
  $li.classList.add("todo-item");
  $li.id = task.id;

  $span.textContent = task.content;

  $actionsDiv.classList.add("actions");
  $completeBtn.classList.add("complete");
  $deleteBtn.classList.add("delete");

  // Icons
  const icon = checkIcon();
  $completeBtn.appendChild(icon);
  $deleteBtn.appendChild(trashIcon());

  // Append
  $actionsDiv.appendChild($completeBtn);
  $actionsDiv.appendChild($deleteBtn);

  $li.appendChild($span);
  $li.appendChild($actionsDiv);

  // Completed state
  if (task.completed) {
    $li.classList.add("done");
    if (icon.classList.contains("fa-check-circle")) {
      icon.classList.replace("fa-check-circle", "fa-undo");
    }

    if (task.order !== "") $li.style.order = task.order;
  }

  return $li;
}
