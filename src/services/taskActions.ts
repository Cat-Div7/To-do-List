import { updateTask, deleteTask } from "../storage/tasks.js";

interface CompeleteTaskParams {
  li: HTMLLIElement;
  icon?: HTMLElement | null;
  getNextOrder: () => number;
}

interface DeleteTaskParams {
  li: HTMLLIElement;
  tasksList: HTMLUListElement;
  resetId: () => void;
}

export function handleCompleteTask({
  li,
  icon,
  getNextOrder,
}: CompeleteTaskParams): void {
  li.classList.toggle("done");

  if (icon) {
    icon.classList.toggle("fa-undo");
    icon.classList.toggle("fa-check-circle");
  }

  const isDone = li.classList.contains("done");

  updateTask(li.id, { completed: isDone });

  if (isDone) {
    const order = getNextOrder();
    li.style.order = String(order);
    updateTask(li.id, { order: String(order) });
  } else {
    li.style.order = "";
    updateTask(li.id, { order: "" });
  }
}

export function handleDeleteTask({
  li,
  tasksList,
  resetId,
}: DeleteTaskParams): void {
  deleteTask(li.id);
  li.remove();

  if (!tasksList.querySelector(".todo-item")) {
    resetId();
  }
}
