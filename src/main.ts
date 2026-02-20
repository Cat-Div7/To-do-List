import { saveTasks, getTasks, resetTasks } from "./storage/tasks.js";
import { createTaskElement } from "./utils/createTaskElement.js";
import { initTheme } from "./utils/theme.js";
import { validateInput } from "./utils/validation.js";
import { showAlert, hideAlert } from "./utils/alert.js";
import { addTaskFlow } from "./services/taskService.js";
import {
  handleCompleteTask,
  handleDeleteTask,
} from "./services/taskActions.js";
import {
  setFilter,
  reapplyCurrentFilter,
  FILTER_STORAGE_KEY,
} from "./services/filterService.js";
// Only type imports use "type"
import { FILTERS } from "./types";
import type { AppDOM } from "./types";

// DOM CACHE
const DOM = {
  modeBtn: document.querySelector<HTMLInputElement>(".toggle-modes")!,
  themeText: document.querySelector<HTMLElement>(".theme-text")!,
  tasksList: document.querySelector<HTMLUListElement>(".todo-list")!,
  inputContainer: document.querySelector<HTMLElement>(".todo-input")!,
  alert: document.querySelector<HTMLElement>(".alert-length")!,
  deleteAllBtn: document.querySelector<HTMLButtonElement>(".delete-all-btn")!,
  filtersContainer: document.querySelector<HTMLElement>(".filters")!,
  filterButtons: document.querySelectorAll<HTMLButtonElement>(".filter-btn"),
  form: document.forms[0] as HTMLFormElement,
};

// derived elements
const appDOM: AppDOM = {
  ...DOM,
  input:
    DOM.inputContainer.querySelector<HTMLInputElement>("input[type='text']")!,
  addBtn: DOM.inputContainer.querySelector<HTMLInputElement>(
    "input[type='submit']",
  )!,
};

// DOM GUARDS
if (
  !appDOM.modeBtn ||
  !appDOM.themeText ||
  !appDOM.tasksList ||
  !appDOM.input ||
  !appDOM.alert ||
  !appDOM.deleteAllBtn ||
  !appDOM.filtersContainer
) {
  throw new Error("DOM initialization failed");
}

// Check if the flag exists in localStorage
if (localStorage.getItem("hasCodeRunBefore") === null) {
  // If not, run the function and set the flag
  runOnceFunction();
  localStorage.setItem("hasCodeRunBefore", "true");
}

function runOnceFunction() {
  const existedElements = [
    { id: "task-0", content: "Learn HTML", completed: false, order: "" },
    { id: "task-1", content: "Style with CSS", completed: false, order: "" },
    {
      id: "task-2",
      content: "Build a To-Do List",
      completed: true,
      order: "",
    },
  ];
  saveTasks(existedElements);
}

// Get All Local Storage Items
window.onload = () => {
  // Theme Mode
  initTheme(appDOM);

  // Input Value
  let inputValueSavec = sessionStorage.getItem("inputValue");
  appDOM.input.value = inputValueSavec || "";

  // Tasks Load
  const tasks = getTasks();
  if (tasks.length > 0) {
    tasks.forEach((task) => {
      // Create New Task Element
      const element = createTaskElement(task);
      appDOM.tasksList.appendChild(element);
    });
  } else {
    saveTasks([]);
  }

  // Load Filter From Local Storage
  const stored = localStorage.getItem(FILTER_STORAGE_KEY);

  const savedFilter =
    stored === FILTERS.ALL ||
    stored === FILTERS.COMPLETED ||
    stored === FILTERS.UNCOMPLETED
      ? stored
      : FILTERS.ALL;

  setFilter(appDOM, savedFilter);

  appDOM.input.focus();
};

// Declare Order To Completed Tasks
let currentOrder = 1;

// Helper Funcs
function generateTaskId(): string {
  return `task-${currentId++}`;
}

function getNextOrder(): number {
  return currentOrder++;
}

function resetTaskId(): void {
  currentId = 0;
}

// Load Id from LocalStorage
const tasks = getTasks();
let currentId: number = tasks.length
  ? Math.max(...tasks.map((t) => Number(t.id.split("-")[1]))) + 1
  : 0;

// Event Delegation for Complete and Delete Buttons
appDOM.tasksList.addEventListener("click", (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  const clickedButton =
    target.closest<HTMLButtonElement>(".complete") ||
    target.closest<HTMLButtonElement>(".delete");

  if (!clickedButton) return;

  const li = clickedButton.closest<HTMLLIElement>(".todo-item");
  if (!li) return;
  const icon = clickedButton.querySelector("i");
  if (!icon) return;

  if (clickedButton.classList.contains("complete")) {
    handleCompleteTask({
      li,
      icon,
      getNextOrder,
    });
    reapplyCurrentFilter(appDOM);
  } else {
    handleDeleteTask({
      li,
      tasksList: appDOM.tasksList,
      resetId: resetTaskId,
    });
    reapplyCurrentFilter(appDOM);
  }
});

// Delete All Button
appDOM.deleteAllBtn.addEventListener("click", () => {
  // Reset (List, order, id) when all the tasks are deleted
  appDOM.tasksList.innerHTML = "";
  currentOrder = Math.max(0, ...tasks.map((t) => Number(t.order) || 0)) + 1;
  currentId = 0;

  // Reset Local Storage
  resetTasks();
});

// Validating The Input
appDOM.input.oninput = () => {
  const value = appDOM.input.value.trim();
  sessionStorage.setItem("inputValue", value);

  const error = validateInput(value);
  if (error) showAlert(appDOM, error);
  else hideAlert(appDOM);
};

// Creating a new task onsubmit
appDOM.form.addEventListener("submit", (e) => {
  e.preventDefault();
  const newTaskValue = appDOM.input.value.trim();
  const error = validateInput(newTaskValue);

  if (error) {
    showAlert(appDOM, error);
    return;
  }
  hideAlert(appDOM);

  addTaskFlow({
    content: newTaskValue,
    tasksList: appDOM.tasksList,
    generateId: generateTaskId,
  });

  reapplyCurrentFilter(appDOM);

  // Reseting the Input Overflow
  appDOM.input.value = "";
  sessionStorage.setItem("inputValue", "");
});

// Toggling active state in filter btns
appDOM.filtersContainer.addEventListener("click", (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  const btn = target.closest<HTMLButtonElement>(".filter-btn");
  if (!btn) return;

  const filterType = btn.dataset.filter;
  if (
    filterType !== FILTERS.ALL &&
    filterType !== FILTERS.COMPLETED &&
    filterType !== FILTERS.UNCOMPLETED
  )
    return;

  setFilter(appDOM, filterType);
});
