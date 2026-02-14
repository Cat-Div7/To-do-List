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
  // TODO: Replace With Custom Func
  localStorage.setItem("tasks", JSON.stringify(existedElements));
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
  let taskExists = localStorage.getItem("tasks");
  if (taskExists) {
    // Add To localStorage
    let array = JSON.parse(window.localStorage.getItem("tasks")) || [];
    // Writing Elements Again
    for (let i = 0; i < array.length; i++) {
      // Create New Task Element
      const $li = document.createElement("li");
      const $span = document.createElement("span");
      const $spanText = document.createTextNode(array[i].content);
      const $actionsDiv = document.createElement("div");
      const $completeBtn = document.createElement("button");
      const $deleteBtn = document.createElement("button");
      // Adding Classes To Each Element Requires
      $li.classList.add("todo-item");
      $li.id = array[i].id;
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
      // Add done Class If Completed Is Marked
      if (array[i].completed === true) {
        $li.classList.add("done");
        // Also ensure the check icon is correctly set if the task is done
        checkIcon.classList.remove("fa-check-circle");
        checkIcon.classList.add("fa-undo");
        // Add Order
        if (array[i].order !== "") {
          $li.style.order = array[i].order;
        }
      }
    }
  } else {
    localStorage.setItem("tasks", JSON.stringify([]));
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
    $li.classList.toggle("done");
    if (icon) {
      icon.classList.toggle("fa-undo");
      icon.classList.toggle("fa-check-circle");
      // Check If Icon Is Undo
      if (icon.classList.contains("fa-undo")) {
        let array = JSON.parse(window.localStorage.getItem("tasks"));
        for (let i = 0; i < array.length; i++) {
          // Update Value When Completed
          if ($li.id === array[i].id) {
            array[i].completed = true;
            localStorage.setItem("tasks", JSON.stringify(array));
          } else {
            continue;
          }
        }
      } else if (icon.classList.contains("fa-check-circle")) {
        let array = JSON.parse(window.localStorage.getItem("tasks"));
        for (let i = 0; i < array.length; i++) {
          // Update Value When UnCompleted
          if ($li.id === array[i].id) {
            array[i].completed = false;
            localStorage.setItem("tasks", JSON.stringify(array));
          } else {
            continue;
          }
        }
      }
    }
    if ($li.classList.contains("done")) {
      $li.style.order = currentOrder;
      // Add To localStorage
      let array = JSON.parse(window.localStorage.getItem("tasks"));
      for (let k = 0; k < array.length; k++) {
        if ($li.id === array[k].id) {
          // Add Order
          array[k].order = currentOrder;
          localStorage.setItem("tasks", JSON.stringify(array));
        } else {
          continue;
        }
      }
      currentOrder++;
    } else {
      $li.style.order = "";
      // Remove Completed Value From LocalStorage
    }
  } else if (clickedButton.classList.contains("delete")) {
    // Remove From Local Storage & Page
    let array = JSON.parse(window.localStorage.getItem("tasks"));
    for (let i = 0; i < array.length; i++) {
      if ($li.id === array[i].id) {
        let updatedArray = array.filter((item) => item.id !== $li.id);
        localStorage.setItem("tasks", JSON.stringify(updatedArray));
        $li.remove();
        currentId--;
      }
    }
    // Reset Id
    let count = tasksList.querySelectorAll(".todo-item").length;
    if (count < 1) {
      currentId = 0;
    }
  }
});

// Delete All Button
const deleteAllBtn = document.querySelector(".delete-all-btn");
deleteAllBtn.addEventListener("click", () => {
  tasksList.innerHTML = "";
  currentOrder = 1; // Reset order when all tasks are deleted
  currentId = 0; // Reset id when all tasks are deleted
  // Edit Local Storage
  localStorage.setItem("tasks", JSON.stringify([]));
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

  // Make Object To Push To Local
  let newTask = {
    id: $li.id,
    content: newTaskValue,
    completed: false,
    order: "",
  };
  // Add To localStorage
  let array = JSON.parse(window.localStorage.getItem("tasks")) || [];
  array.push(newTask);
  // Push Back To LocalStorage
  localStorage.setItem("tasks", JSON.stringify(array));
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