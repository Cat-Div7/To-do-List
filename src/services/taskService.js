import { addTask } from "../storage/tasks.js";
import { createTaskElement } from "../utils/createTaskElement.js";

export function addTaskFlow({
  content,
  tasksList,
  generateId,
}) {
  // create task object
  const task = {
    id: generateId(),
    content,
    completed: false,
    order: "",
  };

  // create DOM element
  const element = createTaskElement(task);

  // append
  tasksList.appendChild(element);

  // persist
  addTask(task);

  return task;
}
