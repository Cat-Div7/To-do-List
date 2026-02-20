import { addTask } from "../storage/tasks.js";
import { createTaskElement } from "../utils/createTaskElement.js";
import type { Task } from "../types/index.js";

interface AddTaskFlowParams {
  content: string;
  tasksList: HTMLUListElement;
  generateId: () => string;
}


export function addTaskFlow({
  content,
  tasksList,
  generateId,
}: AddTaskFlowParams): void {
  // create task object
  const task: Task = {
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
}
