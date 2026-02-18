import { Task } from "../types";

const TASKS_KEY = "tasks";

// Get All Tasks
export function getTasks(): Task[] {
  const stored = localStorage.getItem(TASKS_KEY);
  return stored ? (JSON.parse(stored) as Task[]) : [];
}

// (Save | Set) Tasks Array to localStorage
export function saveTasks(tasks: Task[]): void {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

// Add a New Task
export function addTask(task: Task): void {
  const tasks = getTasks();
  tasks.push(task);
  saveTasks(tasks);
}

// Update an Existing Task by id
// Partial<Type | Interface> makes everything optional
export function updateTask(taskId: string, updateProps: Partial<Task>): void { 
  const tasks = getTasks();
  const newTasks = tasks.map((t) =>
    t.id === taskId ? { ...t, ...updateProps } : t,
  );
  saveTasks(newTasks);
}

// Delete a Task by id
export function deleteTask(taskId: string): void {
  const tasks = getTasks();
  const newTasks = tasks.filter((t) => t.id !== taskId);
  saveTasks(newTasks);
}

export function resetTasks(): void {
  saveTasks([]);
}
