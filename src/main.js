import {
  saveTasks,
  getTasks,
  addTask,
  updateTask,
  deleteTask,
  resetTasks,
} from "./storage/tasks.js";
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
  FILTERS,
  setFilter,
  reapplyCurrentFilter,
} from "./services/filterService.js";

// DOM CACHE
const DOM = {
  modeBtn: document.querySelector(".toggle-modes"),
  themeText: document.querySelector(".theme-text"),

  tasksList: document.querySelector(".todo-list"),
  inputContainer: document.querySelector(".todo-input"),
  alert: document.querySelector(".alert-length"),

  deleteAllBtn: document.querySelector(".delete-all-btn"),
  filtersContainer: document.querySelector(".filters"),
  filterButtons: document.querySelectorAll(".filter-btn"),

  form: document.forms[0],
};

// derived elements
DOM.input = DOM.inputContainer?.querySelector("input[type='text']");
DOM.addBtn = DOM.inputContainer?.querySelector("input[type='submit']");

// DOM GUARDS
if (
  !DOM.modeBtn ||
  !DOM.themeText ||
  !DOM.tasksList ||
  !DOM.input ||
  !DOM.alert ||
  !DOM.deleteAllBtn ||
  !DOM.filtersContainer
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
      completed: false,
      order: "",
    },
  ];
  saveTasks(existedElements);
}

// Get All Local Storage Items
window.onload = () => {
  // Theme Mode
  initTheme(DOM);

  // Input Value
  let inputValueSavec = sessionStorage.getItem("inputValue");
  DOM.input.value = inputValueSavec || "";

  // Tasks Load
  const tasks = getTasks();
  if (tasks.length > 0) {
    tasks.forEach((task) => {
      // Create New Task Element
      const element = createTaskElement(task);
      DOM.tasksList.appendChild(element);
    });
  } else {
    saveTasks([]);
  }

  // Load Filter From Local Storage
  const savedFilter = localStorage.getItem("filterType") || FILTERS.ALL;
  setFilter(DOM, savedFilter);

  DOM.input.focus();
};

// Declare Order To Completed Tasks
let currentOrder = 1;
function generateTaskId() {
  return `task-${currentId++}`;
}

function getNextOrder() {
  return currentOrder++;
}

function resetTaskId() {
  currentId = 0;
}

// Load Id from LocalStorage
const tasks = getTasks();
let currentId = tasks.length
  ? Math.max(...tasks.map((t) => Number(t.id.split("-")[1]))) + 1
  : 0;
// Complete Button Click Event For Existed Elements Before Only
// Add Event Listeners to Existing Buttons on Page Load

// Event Delegation for Complete and Delete Buttons
DOM.tasksList.addEventListener("click", (e) => {
  const clickedButton =
    e.target.closest(".complete") || e.target.closest(".delete");

  if (!clickedButton) return;

  const li = clickedButton.closest(".todo-item");
  const icon = clickedButton.querySelector("i");

  if (clickedButton.classList.contains("complete")) {
    handleCompleteTask({
      li,
      icon,
      getNextOrder,
    });
    reapplyCurrentFilter(DOM);
  } else {
    handleDeleteTask({
      li,
      tasksList: DOM.tasksList,
      resetId: resetTaskId,
    });
    reapplyCurrentFilter(DOM);
  }
});

// Delete All Button
DOM.deleteAllBtn.addEventListener("click", () => {
  // Reset (List, order, id) when all the tasks are deleted
  DOM.tasksList.innerHTML = "";
  currentOrder = Math.max(0, ...tasks.map((t) => t.order || 0)) + 1;
  currentId = 0;

  // Reset Local Storage
  resetTasks();
});

// On Input Check If Value Length is More than 30
DOM.input.oninput = () => {
  const value = DOM.input.value.trim();
  sessionStorage.setItem("inputValue", value);

  const error = validateInput(value);
  if (error) showAlert(DOM, error);
  else hideAlert(DOM);
};

// Adding New Task On Submit
DOM.form.addEventListener("submit", (e) => {
  e.preventDefault();
  const newTaskValue = DOM.input.value.trim();
  const error = validateInput(newTaskValue);

  if (error) {
    showAlert(DOM, error);
    return;
  }
  hideAlert(DOM);

  // Create task object
  addTaskFlow({
    content: newTaskValue,
    tasksList: DOM.tasksList,
    generateId: generateTaskId,
  });

  reapplyCurrentFilter(DOM);

  // Delete Input Value From Overflow
  DOM.input.value = "";
  sessionStorage.setItem("inputValue", "");
});

DOM.filtersContainer.addEventListener("click", (e) => {
  const btn = e.target.closest(".filter-btn");
  if (!btn) return;

  const filterType = btn.dataset.filter;
  if (!filterType) return;

  setFilter(DOM, filterType);
});
