const TASKS_KEY = "tasks";

// Get All Tasks
export function getTasks() {
  const stored = localStorage.getItem(TASKS_KEY);
  return stored ? JSON.parse(stored) : [];
}

// (Save | Set) Tasks Array to localStorage
export function saveTasks(tasks) {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

// Add a New Task
export function addTask(task) {
  const tasks = getTasks();
  tasks.push(task);
  saveTasks(tasks);
}

// Update an Existing Task by id
export function updateTask(taskId, updateProps) {
  const tasks = getTasks();
  const newTasks = tasks.map((t) =>
    t.id === taskId ? { ...t, ...updateProps } : t,
  );
  saveTasks(newTasks);
}

// Delete a Task by id
export function deleteTask(taskId) {
  const tasks = getTasks();
  const newTasks = tasks.filter((t) => t.id !== taskId);
  saveTasks(newTasks);
}

export function resetTasks() {
  saveTasks([]);
}
