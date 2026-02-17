export const FILTER_STORAGE_KEY = "filterType";

export const FILTERS = {
  ALL: "all",
  COMPLETED: "completed",
  UNCOMPLETED: "uncompleted",
};

export function applyFilter(DOM, filterType) {
  const tasks = DOM.tasksList.querySelectorAll(".todo-item");

  tasks.forEach((task) => {
    const isDone = task.classList.contains("done");

    const shouldShow =
      filterType === FILTERS.ALL ||
      (filterType === FILTERS.COMPLETED && isDone) ||
      (filterType === FILTERS.UNCOMPLETED && !isDone);

    task.style.display = shouldShow ? "flex" : "none";
  });
}

export function updateActiveFilterButton(DOM, filterType) {
  DOM.filterButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.filter === filterType);
  });
}

export function setFilter(DOM, filterType) {
  localStorage.setItem(FILTER_STORAGE_KEY, filterType);

  updateActiveFilterButton(DOM, filterType);
  applyFilter(DOM, filterType);
}

export function reapplyCurrentFilter(DOM) {
  const currentFilter = localStorage.getItem(FILTER_STORAGE_KEY) || FILTERS.ALL;

  applyFilter(DOM, currentFilter);
}
