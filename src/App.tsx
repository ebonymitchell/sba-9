
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

// Store task data and theme preferences under separate keys.
const TASK_STORAGE_KEY = "task-dashboard-tasks";
const THEME_STORAGE_KEY = "task-dashboard-theme";

// Restrict the theme to the two supported options.
type Theme = "light" | "dark";

// Display example tasks when no saved data exists.
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

// Configure the initial search, filter, and sorting settings.
const initialFilters: TaskFilters = {
  status: "all",
  priority: "all",
  search: "",
  sortBy: "manual",
};

function App() {
  // Restore saved tasks from localStorage when the app loads.
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const savedTasks = localStorage.getItem(
        TASK_STORAGE_KEY
      );

      if (savedTasks !== null) {
        const parsed: unknown = JSON.parse(savedTasks);

        // Only accept data matching the expected Task structure.
        if (isTaskArray(parsed)) {
          return parsed;
        }
      }
    } catch (error) {
      console.error(
        "Unable to load saved tasks:",
        error
      );
    }

    return initialTasks;
  });

  // Track the current filters and selected task for editing.
  const [filters, setFilters] =
    useState<TaskFilters>(initialFilters);

  const [editingTask, setEditingTask] =
    useState<Task | null>(null);

  // Restore the user's previously selected color theme.
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const savedTheme = localStorage.getItem(
        THEME_STORAGE_KEY
      );

      return savedTheme === "dark" ? "dark" : "light";
    } catch (error) {
      console.error(
        "Unable to load theme preference:",
        error
      );

      return "light";
    }
  });

  // Reference the hidden input used to upload JSON files.
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Display confirmation and error messages.
  const [message, setMessage] = useState("");

  // Save task changes automatically.
  useEffect(() => {
    try {
      localStorage.setItem(
        TASK_STORAGE_KEY,
        JSON.stringify(tasks)
      );
    } catch (error) {
      console.error(
        "Unable to save tasks:",
        error
      );
    }
  }, [tasks]);

  // Apply and persist the selected color theme.
  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      theme
    );

    try {
      localStorage.setItem(
        THEME_STORAGE_KEY,
        theme
      );
    } catch (error) {
      console.error(
        "Unable to save theme preference:",
        error
      );
    }
  }, [theme]);

  // Filter and sort tasks whenever task data or filters change.
  const visibleTasks = useMemo(() => {
    const filtered = filterTasks(tasks, filters);

    return sortTasks(filtered, filters.sortBy);
  }, [tasks, filters]);

  // Create a task or update an existing task.
  const handleSubmit = (data: TaskFormData) => {
    if (editingTask !== null) {
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

    // New tasks appear at the end of the manual order.
    const nextOrder =
      Math.max(
        -1,
        ...tasks.map((task) => task.order)
      ) + 1;

    const newTask: Task = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      order: nextOrder,
    };

    setTasks((previous) => [
      ...previous,
      newTask,
    ]);

    setMessage("Task added successfully.");
  };

  // Update the completion status of a task.
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

    setMessage("Task status updated.");
  };

  // Remove a task from the dashboard.
  const handleDelete = (id: string) => {
    setTasks((previous) =>
      previous.filter((task) => task.id !== id)
    );

    // Close the edit form if its task was deleted.
    if (editingTask?.id === id) {
      setEditingTask(null);
    }

    setMessage("Task deleted.");
  };

  // Move a task up or down in its manually assigned order.
  const handleMove = (
    id: string,
    direction: "up" | "down"
  ) => {
    // When filters are active, only visible tasks are reordered.
    // Other tasks keep their relative positions.
    const currentVisible = sortTasks(
      filterTasks(tasks, filters),
      filters.sortBy
    );

    const currentIndex = currentVisible.findIndex(
      (task) => task.id === id
    );

    const targetIndex =
      direction === "up"
        ? currentIndex - 1
        : currentIndex + 1;

    // Ignore moves beyond the visible list boundaries.
    if (
      currentIndex < 0 ||
      targetIndex < 0 ||
      targetIndex >= currentVisible.length
    ) {
      return;
    }

    // Build the new visible order after swapping neighbors.
    const reorderedVisible = [...currentVisible];

    [
      reorderedVisible[currentIndex],
      reorderedVisible[targetIndex],
    ] = [
        reorderedVisible[targetIndex],
        reorderedVisible[currentIndex],
      ];

    const reorderedIds = reorderedVisible.map(
      (task) => task.id
    );

    setTasks((previous) => {
      // Start with the complete saved manual order.
      const ordered = [...previous].sort(
        (a, b) => a.order - b.order
      );

      // Identify slots belonging to currently visible tasks.
      const visibleIds = new Set(reorderedIds);

      const visibleSlots = ordered
        .map((task, index) =>
          visibleIds.has(task.id) ? index : -1
        )
        .filter((index) => index >= 0);

      // Place reordered visible tasks into those slots.
      const taskById = new Map(
        ordered.map((task) => [task.id, task])
      );

      visibleSlots.forEach((slot, index) => {
        const task = taskById.get(reorderedIds[index]);

        if (task) {
          ordered[slot] = task;
        }
      });

      // Save the updated sequence with consecutive positions.
      return ordered.map((task, index) => ({
        ...task,
        order: index,
      }));
    });

    // Show the saved order rather than due-date or priority order.
    setFilters((previous) => ({
      ...previous,
      sortBy: "manual",
    }));

    setMessage("Task order updated.");
  };

  // Download all tasks as a JSON backup.
  const handleExport = () => {
    try {
      const json = JSON.stringify(tasks, null, 2);

      const blob = new Blob([json], {
        type: "application/json",
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "task-dashboard-backup.json";

      document.body.appendChild(link);
      link.click();
      link.remove();

      // Release the temporary object URL after downloading.
      window.setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 1000);

      setMessage(
        "Task backup exported successfully."
      );
    } catch (error) {
      console.error(
        "Unable to export tasks:",
        error
      );

      setMessage("Unable to export tasks.");
    }
  };

  // Import tasks from a previously exported JSON file.
  const handleImport = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const contents = await file.text();
      const parsed: unknown = JSON.parse(contents);

      // Reject invalid or incompatible backup files.
      if (!isTaskArray(parsed)) {
        throw new Error(
          "The selected file does not contain valid tasks."
        );
      }

      // Require confirmation before replacing saved tasks.
      const confirmed = window.confirm(
        "Importing will replace your current tasks. Continue?"
      );

      if (!confirmed) {
        setMessage("Import canceled.");
        return;
      }

      setTasks(parsed);
      setEditingTask(null);

      // Show imported tasks in their saved manual order.
      setFilters({
        ...initialFilters,
        sortBy: "manual",
      });

      setMessage(
        "Tasks imported successfully."
      );
    } catch (error) {
      console.error(
        "Unable to import tasks:",
        error
      );

      setMessage(
        "Import failed. Please select a valid task backup."
      );
    } finally {
      // Allow users to select the same backup again.
      event.target.value = "";
    }
  };

  // Switch between light and dark color themes.
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
      {/* Import and export controls */}
      <section
        className="data-actions"
        aria-label="Task data management"
      >
        <button
          type="button"
          onClick={handleExport}
        >
          Export Tasks
        </button>

        <button
          type="button"
          onClick={() =>
            fileInputRef.current?.click()
          }
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

      {/* Announce feedback to users and assistive technology. */}
      {message && (
        <p
          className="action-message"
          role="status"
        >
          {message}
        </p>
      )}

      {/* Task creation and editing form */}
      <TaskForm
        editingTask={editingTask}
        onSubmit={handleSubmit}
        onCancel={() => setEditingTask(null)}
      />

      {/* Search, status, priority, and sorting controls */}
      <TaskFilter
        filters={filters}
        onFilterChange={setFilters}
      />

      {/* Display tasks matching the selected filters. */}
      <section className="task-section">
        <h2>
          Your Tasks ({visibleTasks.length})
        </h2>

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
