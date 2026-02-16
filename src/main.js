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
  const existFilter = localStorage.getItem("filterType");
  if (existFilter) {
    filterTasks(existFilter);
    // remove active from all cached buttons
    DOM.filterButtons.forEach((btn) => btn.classList.remove("active"));
    // activate matching button
    const activeBtn = DOM.filtersContainer.querySelector(
      `[data-filter='${existFilter}']`,
    );
    if (activeBtn) activeBtn.classList.add("active");
  }

  DOM.input.focus();
};

// Declare Order To Completed Tasks
let currentOrder = 1;
function generateTaskId() {
  return `task-${currentId++}`;
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
  // Get Clicked Button
  const clickedButton =
    e.target.closest(".complete") || e.target.closest(".delete");
  if (!clickedButton) return;
  // Select Elements
  const $li = clickedButton.closest(".todo-item");
  const icon = clickedButton.querySelector("i");
  // Check If Complete Button Or Delete
  if (clickedButton.classList.contains("complete")) {
    // Toggle done class on the task
    $li.classList.toggle("done");

    if (icon) {
      // Toggle the icon between check-circle and undo
      icon.classList.toggle("fa-undo");
      icon.classList.toggle("fa-check-circle");
    }

    // Update completed value in LocalStorage based on 'done' class
    updateTask($li.id, { completed: $li.classList.contains("done") });

    if ($li.classList.contains("done")) {
      // Add order to completed task
      $li.style.order = currentOrder;

      // Update order in LocalStorage
      updateTask($li.id, { order: currentOrder });

      currentOrder++;
    } else {
      // Remove order if task is uncompleted
      $li.style.order = "";
      // Reset order in LocalStorage
      updateTask($li.id, { order: "" });
    }
  } else if (clickedButton.classList.contains("delete")) {
    // Remove From Local Storage Using helper
    deleteTask($li.id);
    // Remove Fron the Page
    $li.remove();
    // Reset ID if list is empty
    const count = DOM.tasksList.querySelectorAll(".todo-item").length;
    if (count < 1) currentId = 0;
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

  // Delete Input Value From Overflow
  DOM.input.value = "";
  sessionStorage.setItem("inputValue", "");
});

DOM.filtersContainer.addEventListener("click", (e) => {
  const clickedFilter = e.target.closest(".filter-btn");
  if (!clickedFilter) return;
  // clear active state
  DOM.filterButtons.forEach((btn) => btn.classList.remove("active"));
  // activate clicked
  clickedFilter.classList.add("active");
  // apply filter
  const filterType = clickedFilter.getAttribute("data-filter");
  if (!filterType) return;
  localStorage.setItem("filterType", filterType);
  filterTasks(filterType);
});

function filterTasks(filterType = "all") {
  const tasks = DOM.tasksList.querySelectorAll(".todo-item");

  tasks.forEach((task) => {
    switch (filterType) {
      // All Tasks
      case "all":
        task.style.display = "flex";
        break;

      // Completed Tasks
      case "completed":
        if (task.classList.contains("done")) {
          task.style.display = "flex";
        } else {
          task.style.display = "none";
        }
        break;

      // UnCompleted Tasks
      case "uncompleted":
        if (!task.classList.contains("done")) {
          task.style.display = "flex";
        } else {
          task.style.display = "none";
        }
        break;
    }
  });
}

// Initial filter application on load (optional, defaults to 'all')
filterTasks("all");
