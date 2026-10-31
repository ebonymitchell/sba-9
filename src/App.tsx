import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ChangeEvent } from "react";

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

// Sample tasks
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

// Default search, filtering, and sorting settings.
const initialFilters: TaskFilters = {
  status: "all",
  priority: "all",
  search: "",
  sortBy: "dueDate-asc",
};

const STORAGE_KEY = "task-dashboard-tasks";

function App() {
  // Load previously saved tasks when the application starts.
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const savedTasks = localStorage.getItem(STORAGE_KEY);

      if (savedTasks !== null) {
        const parsed: unknown = JSON.parse(savedTasks);

        // Validate saved data before using it.
        if (isTaskArray(parsed)) {
          return parsed;
        }
      }
    } catch (error) {
      console.error("Unable to load saved tasks:", error);
    }

    return initialTasks;
  });

  // Manage filters and the task currently being edited.
  const [filters, setFilters] =
    useState<TaskFilters>(initialFilters);

  const [editingTask, setEditingTask] =
    useState<Task | null>(null);

  // Reference the hidden file input used for importing JSON.
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Display feedback after importing or exporting tasks.
  const [message, setMessage] = useState("");

  // Save tasks whenever the task array changes.
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(tasks)
      );
    } catch (error) {
      console.error("Unable to save tasks:", error);
    }
  }, [tasks]);

  // Calculate visible tasks without modifying the original array.
  const visibleTasks = useMemo(
    () =>
      sortTasks(
        filterTasks(tasks, filters),
        filters.sortBy
      ),
    [tasks, filters]
  );

  // Create a new task or update an existing task.
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

  // Update the status of a selected task.
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

  // Remove a task from the dashboard.
  const handleDelete = (id: string) => {
    setTasks((previous) =>
      previous.filter((task) => task.id !== id)
    );

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

      // Prevent movement outside the task list.
      if (
        index < 0 ||
        nextIndex < 0 ||
        nextIndex >= ordered.length
      ) {
        return previous;
      }

      // Swap neighboring tasks.
      [ordered[index], ordered[nextIndex]] = [
        ordered[nextIndex],
        ordered[index],
      ];

      // Reassign order numbers after moving tasks.
      return ordered.map((task, position) => ({
        ...task,
        order: position,
      }));
    });
  };

  // Export all tasks as a downloadable JSON backup.
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

      // Release the temporary object URL.
      window.setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 1000);

      setMessage("Task backup exported successfully.");
    } catch (error) {
      console.error("Unable to export tasks:", error);
      setMessage("Unable to export tasks.");
    }
  };

  // Import tasks from a JSON file after validating its structure.
  const handleImport = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      const contents = await file.text();
      const parsed: unknown = JSON.parse(contents);

      // Reject files that do not contain valid task objects.
      if (!isTaskArray(parsed)) {
        throw new Error("Invalid task data format.");
      }

      // Import replaces the existing task list.
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
      // Allow the same file to be selected again.
      event.target.value = "";
    }
  };

  // Calculate statistics from the full task list.
  const completed = tasks.filter(
    (task) => task.status === "completed"
  ).length;

  const inProgress = tasks.filter(
    (task) => task.status === "in-progress"
  ).length;

  const pending = tasks.filter(
    (task) => task.status === "pending"
  ).length;

  return (
    <main className="app-container">
      {/* Dashboard heading */}
      <header className="app-header">
        <h1>Task Management Dashboard</h1>
        <p>
          Stay organized and keep track of your progress.
        </p>
      </header>

      {/* JSON import and export controls */}
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

      {/* Announce task operation feedback */}
      {message && (
        <p className="action-message" role="status">
          {message}
        </p>
      )}

      {/* Dashboard task statistics */}
      <section className="stats-grid">
        {[
          {
            label: "Total Tasks",
            value: tasks.length,
          },
          {
            label: "Completed",
            value: completed,
          },
          {
            label: "In Progress",
            value: inProgress,
          },
          {
            label: "Pending",
            value: pending,
          },
        ].map((stat) => (
          <div
            className="stat-card"
            key={stat.label}
          >
            <h2>{stat.label}</h2>
            <p>{stat.value}</p>
          </div>
        ))}
      </section>

      {/* Controlled form for adding and editing tasks */}
      <TaskForm
        editingTask={editingTask}
        onSubmit={handleSubmit}
        onCancel={() => setEditingTask(null)}
      />

      {/* Task search, filtering, and sorting */}
      <TaskFilter
        filters={filters}
        onFilterChange={setFilters}
      />

      {/* Render the filtered task list */}
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
    </main>
  );
}

export default App;
