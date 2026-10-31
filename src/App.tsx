import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ChangeEvent } from "react";

import Dashboard from "./components/Dashboard/Dashboard";
import TaskList from "./components/TaskList/TaskList";
import TaskForm from "./components/TaskForm/TaskForm";
import TaskFilter from "./components/TaskFilter/TaskFilter";

import type {
  Task,
  TaskFilters,
  TaskFormData,
  TaskStatus,
} from "./types";

import {
  filterTasks,
  sortTasks,
  isTaskArray,
} from "./utils/taskUtils";

import "./App.css";

// Use separate storage keys for tasks and theme preferences.
const TASK_STORAGE_KEY = "task-dashboard-tasks";
const THEME_STORAGE_KEY = "task-dashboard-theme";

type Theme = "light" | "dark";

// Provide example tasks when no saved tasks are available.
const initialTasks: Task[] = [
  {
    id: "1",
    title: "Complete React Dashboard SBA",
    description: "Build the task management dashboard.",
    status: "in-progress",
    priority: "high",
    dueDate: "2026-10-31",
    createdAt: "2026-10-30",
    order: 0,
  },
  {
    id: "2",
    title: "Review TypeScript",
    description: "Practice interfaces and component props.",
    status: "pending",
    priority: "medium",
    dueDate: "2026-11-01",
    createdAt: "2026-10-30",
    order: 1,
  },
  {
    id: "3",
    title: "Push Project to GitHub",
    description: "Commit and push the finished project.",
    status: "completed",
    priority: "low",
    dueDate: "2026-11-02",
    createdAt: "2026-10-30",
    order: 2,
  },
];

// Set the initial filtering and sorting preferences.
const initialFilters: TaskFilters = {
  status: "all",
  priority: "all",
  search: "",
  sortBy: "dueDate-asc",
};

function App() {
  // Load saved tasks and validate their structure.
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem(TASK_STORAGE_KEY);

      if (saved !== null) {
        const parsed: unknown = JSON.parse(saved);

        if (isTaskArray(parsed)) {
          return parsed;
        }
      }
    } catch (error) {
      console.error("Unable to load saved tasks:", error);
    }

    return initialTasks;
  });

  // Manage task filters and editing state.
  const [filters, setFilters] =
    useState<TaskFilters>(initialFilters);

  const [editingTask, setEditingTask] =
    useState<Task | null>(null);

  // Restore the user's previously selected theme.
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      return localStorage.getItem(THEME_STORAGE_KEY) === "dark"
        ? "dark"
        : "light";
    } catch {
      return "light";
    }
  });

  // Access the hidden file input used for JSON imports.
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Display feedback after task operations.
  const [message, setMessage] = useState("");

  // Persist task changes in localStorage.
  useEffect(() => {
    try {
      localStorage.setItem(
        TASK_STORAGE_KEY,
        JSON.stringify(tasks)
      );
    } catch (error) {
      console.error("Unable to save tasks:", error);
    }
  }, [tasks]);

  // Apply the selected theme and save the preference.
  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      theme
    );

    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (error) {
      console.error("Unable to save theme:", error);
    }
  }, [theme]);

  // Filter and sort tasks without changing the original array.
  const visibleTasks = useMemo(
    () =>
      sortTasks(
        filterTasks(tasks, filters),
        filters.sortBy
      ),
    [tasks, filters]
  );

  // Create a new task or update the selected task.
  const handleSubmit = (data: TaskFormData) => {
    if (editingTask) {
      setTasks((previous) =>
        previous.map((task) =>
          task.id === editingTask.id
            ? { ...task, ...data }
            : task
        )
      );

      setEditingTask(null);
      setMessage("Task updated successfully.");
      return;
    }

    const newTask: Task = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      order:
        Math.max(
          -1,
          ...tasks.map((task) => task.order)
        ) + 1,
    };

    setTasks((previous) => [...previous, newTask]);
    setMessage("Task added successfully.");
  };

  // Update a task's status.
  const handleStatusChange = (
    id: string,
    status: TaskStatus
  ) => {
    setTasks((previous) =>
      previous.map((task) =>
        task.id === id
          ? { ...task, status }
          : task
      )
    );
  };

  // Delete a task and clear the editing state if necessary.
  const handleDelete = (id: string) => {
    setTasks((previous) =>
      previous.filter((task) => task.id !== id)
    );

    if (editingTask?.id === id) {
      setEditingTask(null);
    }

    setMessage("Task deleted.");
  };

  // Reorder tasks by swapping their manual positions.
  const handleMove = (
    id: string,
    direction: "up" | "down"
  ) => {
    setTasks((previous) => {
      const ordered = [...previous].sort(
        (a, b) => a.order - b.order
      );

      const index = ordered.findIndex(
        (task) => task.id === id
      );

      const nextIndex =
        direction === "up"
          ? index - 1
          : index + 1;

      // Do nothing if the task cannot move further.
      if (
        index < 0 ||
        nextIndex < 0 ||
        nextIndex >= ordered.length
      ) {
        return previous;
      }

      // Exchange the positions of neighboring tasks.
      [ordered[index], ordered[nextIndex]] = [
        ordered[nextIndex],
        ordered[index],
      ];

      // Assign sequential order values after the swap.
      return ordered.map((task, position) => ({
        ...task,
        order: position,
      }));
    });
  };

  // Export all tasks to a downloadable JSON file.
  const handleExport = () => {
    try {
      const blob = new Blob(
        [JSON.stringify(tasks, null, 2)],
        { type: "application/json" }
      );

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "task-dashboard-backup.json";

      document.body.appendChild(link);
      link.click();
      link.remove();

      // Release the temporary download URL.
      window.setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 1000);

      setMessage("Task backup exported successfully.");
    } catch (error) {
      console.error("Unable to export tasks:", error);
      setMessage("Unable to export tasks.");
    }
  };

  // Import task data from a valid JSON backup.
  const handleImport = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      const contents = await file.text();
      const parsed: unknown = JSON.parse(contents);

      // Validate the file before replacing existing tasks.
      if (!isTaskArray(parsed)) {
        throw new Error("Invalid task data format.");
      }

      const confirmed = window.confirm(
        "Importing will replace your current tasks. Continue?"
      );

      if (!confirmed) {
        setMessage("Import canceled.");
        return;
      }

      setTasks(parsed);
      setEditingTask(null);
      setMessage("Tasks imported successfully.");
    } catch (error) {
      console.error("Unable to import tasks:", error);
      setMessage(
        "Import failed. Please select a valid task backup."
      );
    } finally {
      // Reset the input to allow importing the same file again.
      event.target.value = "";
    }
  };

  // Switch between light and dark mode.
  const handleThemeToggle = () => {
    setTheme((previous) =>
      previous === "light" ? "dark" : "light"
    );
  };

  return (
    <Dashboard
      tasks={tasks}
      theme={theme}
      onThemeToggle={handleThemeToggle}
    >
      {/* JSON backup controls */}
      <section
        className="data-actions"
        aria-label="Task data management"
      >
        <button type="button" onClick={handleExport}>
          Export Tasks
        </button>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
        >
          Import Tasks
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          onChange={handleImport}
          aria-label="Select a task backup file"
          style={{ display: "none" }}
        />
      </section>

      {/* Display task operation feedback. */}
      {message && (
        <p className="action-message" role="status">
          {message}
        </p>
      )}

      {/* Task creation and editing form */}
      <TaskForm
        editingTask={editingTask}
        onSubmit={handleSubmit}
        onCancel={() => setEditingTask(null)}
      />

      {/* Search, filtering, and sorting controls */}
      <TaskFilter
        filters={filters}
        onFilterChange={setFilters}
      />

      {/* Display tasks matching the current filters. */}
      <section className="task-section">
        <h2>Your Tasks ({visibleTasks.length})</h2>

        <TaskList
          tasks={visibleTasks}
          onStatusChange={handleStatusChange}
          onEdit={setEditingTask}
          onDelete={handleDelete}
          onMove={handleMove}
        />
      </section>
    </Dashboard>
  );
}

export default App;
