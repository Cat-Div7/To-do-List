import {
  saveTasks,
  getTasks,
  addTask,
  updateTask,
  deleteTask,
  resetTasks,
} from "./storage/tasks";

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
  let themeMode = localStorage.getItem("themeMode");
  if (themeMode) {
    document.body.classList.add(themeMode);
    // Set the checkbox state and text based on the loaded theme
    if (themeMode === "dark-mode") {
      modeBtn.checked = true;
      themeText.textContent = "Light Mode =>";
    } else {
      modeBtn.checked = false;
      themeText.textContent = "Dark Mode =>";
    }
  }

  // Input Value
  let inputValueSavec = sessionStorage.getItem("inputValue");
  input.value = inputValueSavec;

  // Tasks Load
  const tasks = getTasks();

  if (tasks.length > 0) {
    tasks.forEach((task) => {
      // Create New Task Element
      const $li = document.createElement("li");
      const $span = document.createElement("span");
      $span.textContent = task.content;
      const $actionsDiv = document.createElement("div");
      const $completeBtn = document.createElement("button");
      const $deleteBtn = document.createElement("button");

      $li.classList.add("todo-item");
      $li.id = task.id;
      $actionsDiv.classList.add("actions");
      $completeBtn.classList.add("complete");
      $deleteBtn.classList.add("delete");

      const checkIcon = document.createElement("i");
      checkIcon.classList.add("fas", "fa-check-circle");
      const trashIcon = document.createElement("i");
      trashIcon.classList.add("fas", "fa-times-circle");

      $completeBtn.appendChild(checkIcon);
      $deleteBtn.appendChild(trashIcon);

      $actionsDiv.appendChild($completeBtn);
      $actionsDiv.appendChild($deleteBtn);

      $li.appendChild($span);
      $li.appendChild($actionsDiv);
      tasksList.appendChild($li);

      if (task.completed) {
        $li.classList.add("done");
        checkIcon.classList.replace("fa-check-circle", "fa-undo");
        if (task.order !== "") $li.style.order = task.order;
      }
    });
  } else {
    saveTasks([]);
  }

  // Load Filter From Local Storage
  let existFilter = localStorage.getItem("filterType");
  if (existFilter) {
    console.log(existFilter);
    filterTasks(existFilter);
    document.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.classList.remove("active");
      document
        .querySelector(`[data-filter='${existFilter}']`)
        .classList.add("active");
    });
    // Add 'active' class to the clicked button
  }
};

// Dark Mode Settings
const modeBtn = document.querySelector(".toggle-modes");
const themeText = document.querySelector(".theme-text");
modeBtn.addEventListener("click", () => {
  if (modeBtn.checked) {
    // Add Class To Body If Toggle Checked
    themeText.textContent = "Dark Mode =>";
    document.body.classList.remove("normal-mode");
    document.body.classList.add("dark-mode");
    // Change Toggle Button Text
    themeText.textContent = "Light Mode =>";
    // Store In Local Storage
    localStorage.setItem("themeMode", "dark-mode");
  } else {
    document.body.classList.remove("dark-mode");
    document.body.classList.add("normal-mode");
    themeText.textContent = "Dark Mode =>";
    // Store In Local Storage
    localStorage.setItem("themeMode", "normal-mode");
  }
});
// To Do Elements
const tasksList = document.querySelector(".todo-list");
const inputContainer = document.querySelector(".todo-input");
const input = inputContainer.querySelector("input[type='text']");
const addBtn = inputContainer.querySelector("input[type='submit']");
const alert = document.querySelector(".alert-length");
// Declare Order To Completed Tasks
let currentOrder = 1;
let currentId = 3;
// Icons For Existed Elements Before Only
const checkIconExistElements = document.createElement("i");
checkIconExistElements.classList.add("fas", "fa-check-circle");
const trashIconExistElements = document.createElement("i");
trashIconExistElements.classList.add("fas", "fa-times-circle");
// Complete Button Click Event For Existed Elements Before Only
// Add Event Listeners to Existing Buttons on Page Load

// Event Delegation for Complete and Delete Buttons
tasksList.addEventListener("click", (e) => {
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
    currentId--;
    // Reset ID if list is empty
    const count = tasksList.querySelectorAll(".todo-item").length;
    if (count < 1) currentId = 0;
  }
});

// Delete All Button
const deleteAllBtn = document.querySelector(".delete-all-btn");
deleteAllBtn.addEventListener("click", () => {
  // Reset (List, order, id) when all the tasks are deleted
  tasksList.innerHTML = "";
  currentOrder = 1;
  currentId = 0;

  // Reset Local Storage
  resetTasks();
});

// On Input Check If Value Length is More than 30
input.oninput = () => {
  sessionStorage.setItem("inputValue", input.value.trim());
  if (input.value.trim().length > 30) {
    alert.classList.add("d-block");
    inputContainer.classList.add("ally-active");
    alert.textContent = `Task name character limit: ${
      input.value.trim().length
    } / 30`;
  } else {
    if (alert.classList.contains("d-block")) {
      alert.classList.remove("d-block");
      inputContainer.classList.remove("ally-active");
    }
  }
};

// Adding New Task On Submit
document.forms[0].addEventListener("submit", (e) => {
  e.preventDefault();
  let newTaskValue = input.value.trim();
  // Check If Value is empty
  if (newTaskValue === "") {
    alert.classList.add("d-block");
    inputContainer.classList.add("ally-active");
    alert.textContent = "Cell Can't be Empty";
    return; // Stop
  }
  // Check Before Remove Classes To Skip if false
  if (alert.classList.contains("d-block")) {
    alert.classList.remove("d-block");
    inputContainer.classList.remove("ally-active");
  }
  // After Check on Classes Check if value length is more than 40
  if (newTaskValue.length > 30) {
    alert.classList.add("d-block");
    inputContainer.classList.add("ally-active");
    alert.textContent = `Task name character limit: ${newTaskValue.length} / 30`;
    return; // Stop
  }
  // Delete Input Value From Overflow
  input.value = "";
  sessionStorage.setItem("inputValue", "");
  // Create New Task Element
  const $li = document.createElement("li");
  const $span = document.createElement("span");
  const $spanText = document.createTextNode(newTaskValue);
  const $actionsDiv = document.createElement("div");
  const $completeBtn = document.createElement("button");
  const $deleteBtn = document.createElement("button");
  // Adding Classes To Each Element Requires
  $li.classList.add("todo-item");
  $li.id = `task-${currentId++}`;
  $actionsDiv.classList.add("actions");
  $completeBtn.classList.add("complete");
  $deleteBtn.classList.add("delete");
  // Append Task Text To parent
  $span.appendChild($spanText);
  // Add Icons To Btns
  // Add Icons To Btns (Locally created for each task)
  const checkIcon = document.createElement("i");
  checkIcon.classList.add("fas", "fa-check-circle");
  const trashIcon = document.createElement("i");
  trashIcon.classList.add("fas", "fa-times-circle");
  $completeBtn.appendChild(checkIcon);
  $deleteBtn.appendChild(trashIcon);
  // Append Actions To Action Div
  $actionsDiv.appendChild($completeBtn);
  $actionsDiv.appendChild($deleteBtn);
  // Appending Elements To Parent
  $li.appendChild($span);
  $li.appendChild($actionsDiv);
  tasksList.appendChild($li);

  // Make mewTask Object
  let newTask = {
    id: $li.id,
    content: newTaskValue,
    completed: false,
    order: "",
  };

  // Add Task to LocalStorage
  addTask(newTask);
});

// Filters
const filtersContainer = document.querySelector(".filters");
const all = document.querySelector("[data-filter='all']");
const completedFilter = document.querySelector("[data-filter='completed']");
const unCompletedFilter = document.querySelector("[data-filter='uncompleted']");

filtersContainer.addEventListener("click", (e) => {
  const clickedFilter = e.target.closest(".filter-btn");
  if (!clickedFilter) return;
  // Remove 'active' class from all filter buttons
  document
    .querySelectorAll(".filter-btn")
    .forEach((btn) => btn.classList.remove("active"));
  // Add 'active' class to the clicked button
  clickedFilter.classList.add("active");
  // Get Data From data-filter To Use it In Switch Function
  const filterType = clickedFilter.getAttribute("data-filter");
  localStorage.setItem("filterType", filterType);
  filterTasks(filterType);
});

function filterTasks(filterType) {
  const tasks = document.querySelectorAll(".todo-item");
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
