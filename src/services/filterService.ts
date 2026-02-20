import type { AppDOM } from "../types/index.js";
import { FILTERS, type FilterType } from "../types/index.js";

export const FILTER_STORAGE_KEY = "filterType";

export function applyFilter(DOM: AppDOM, filterType: FilterType): void {
  const tasks = DOM.tasksList.querySelectorAll<HTMLLIElement>(".todo-item");

  tasks.forEach((task) => {
    const isDone = task.classList.contains("done");

    const shouldShow =
      filterType === FILTERS.ALL ||
      (filterType === FILTERS.COMPLETED && isDone) ||
      (filterType === FILTERS.UNCOMPLETED && !isDone);

    task.style.display = shouldShow ? "flex" : "none";
  });
}

export function updateActiveFilterButton(
  DOM: AppDOM,
  filterType: FilterType,
): void {
  DOM.filterButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.filter === filterType);
  });
}

export function setFilter(DOM: AppDOM, filterType: FilterType): void {
  localStorage.setItem(FILTER_STORAGE_KEY, filterType);

  updateActiveFilterButton(DOM, filterType);
  applyFilter(DOM, filterType);
}

export function reapplyCurrentFilter(DOM: AppDOM): void {
  const stored = localStorage.getItem(FILTER_STORAGE_KEY);

  const currentFilter: FilterType =
    stored === FILTERS.ALL ||
    stored === FILTERS.COMPLETED ||
    stored === FILTERS.UNCOMPLETED
      ? stored
      : FILTERS.ALL;

  applyFilter(DOM, currentFilter);
}
