import { Task } from "@/types/tasks";

const STORAGE_KEY = "tasks";

let tasks: Task[] = [];

function initializeTasks(): void {
  if (typeof window === "undefined") return;
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      tasks = parsed.map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt),
      }));
    } catch (error) {
      console.error("Failed to parse tasks from localStorage:", error);
      tasks = getDefaultTasks();
    }
  } else {
    tasks = getDefaultTasks();
    saveTasks();
  }
}

function getDefaultTasks(): Task[] {
  return [
    {
      id: "1",
      title: "Learn Kilo Code basics",
      description: "Complete the setup and autocomplete sections",
      status: "in-progress",
      priority: "high",
      createdAt: new Date(),
    },
    {
      id: "2",
      title: "Build the Task Tracker UI",
      description: "Create components using AI assistance",
      status: "todo",
      priority: "medium",
      createdAt: new Date(),
    },
  ];
}

function saveTasks(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

export function getTasks(): Task[] {
  if (tasks.length === 0 && typeof window !== "undefined") {
    initializeTasks();
  }
  return tasks;
}

export function addTask(task: Omit<Task, "id" | "createdAt">): Task {
  const newTask: Task = {
    ...task,
    id: Date.now().toString(),
    createdAt: new Date(),
  };
  tasks.push(newTask);
  saveTasks();
  return newTask;
}

export function updateTaskStatus(id: string, status: Task["status"]): Task | undefined {
  const task = tasks.find((t) => t.id === id);
  if (task) {
    task.status = status;
    saveTasks();
  }
  return task;
}

export function deleteTask(id: string): boolean {
  const len = tasks.length;
  tasks = tasks.filter((t) => t.id !== id);
  if (len !== tasks.length) {
    saveTasks();
    return true;
  }
  return false;
}