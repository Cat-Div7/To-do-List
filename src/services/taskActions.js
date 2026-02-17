import { updateTask, deleteTask } from "../storage/tasks.js";

export function handleCompleteTask({ li, icon, getNextOrder }) {
  li.classList.toggle("done");

  if (icon) {
    icon.classList.toggle("fa-undo");
    icon.classList.toggle("fa-check-circle");
  }

  const isDone = li.classList.contains("done");

  updateTask(li.id, { completed: isDone });

  if (isDone) {
    const order = getNextOrder();
    li.style.order = order;
    updateTask(li.id, { order });
  } else {
    li.style.order = "";
    updateTask(li.id, { order: "" });
  }
}

export function handleDeleteTask({ li, tasksList, resetId }) {
  deleteTask(li.id);
  li.remove();

  if (!tasksList.querySelector(".todo-item")) {
    resetId();
  }
}
