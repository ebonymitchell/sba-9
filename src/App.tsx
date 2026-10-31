import { useEffect, useMemo, useState } from "react";
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

// Sample tasks displayed when no saved data exists.
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

// Default filtering and sorting settings.
const initialFilters: TaskFilters = {
  status: "all",
  priority: "all",
  search: "",
  sortBy: "dueDate-asc",
};

function App() {
  // Load tasks from localStorage when the application starts.
  // If no valid saved data exists, use the sample tasks.
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const savedTasks = localStorage.getItem(
        "task-dashboard-tasks"
      );

      if (savedTasks) {
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

  // Manage filtering, sorting, and the currently edited task.
  const [filters, setFilters] = useState<TaskFilters>(
    initialFilters
  );

  const [editingTask, setEditingTask] = useState<Task | null>(
    null
  );

  // Automatically save tasks whenever the task array changes.
  useEffect(() => {
    try {
      localStorage.setItem(
        "task-dashboard-tasks",
        JSON.stringify(tasks)
      );
    } catch (error) {
      console.error("Unable to save tasks:", error);
    }
  }, [tasks]);

  // Filter and sort tasks without modifying the original array.
  // useMemo recalculates only when tasks or filters change.
  const visibleTasks = useMemo(
    () => sortTasks(filterTasks(tasks, filters), filters.sortBy),
    [tasks, filters]
  );

  // Add a new task or update an existing task.
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
      return;
    }

    // Generate an ID, creation date, and order for new tasks.
    const newTask: Task = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      order: Math.max(-1, ...tasks.map((task) => task.order)) + 1,
    };

    setTasks((previous) => [...previous, newTask]);
  };

  // Update a task's status without mutating React state.
  const handleStatusChange = (
    id: string,
    status: TaskStatus
  ) => {
    setTasks((previous) =>
      previous.map((task) =>
        task.id === id ? { ...task, status } : task
      )
    );
  };

  // Delete a task by its ID.
  const handleDelete = (id: string) => {
    setTasks((previous) =>
      previous.filter((task) => task.id !== id)
    );

    // Stop editing if the deleted task was selected.
    if (editingTask?.id === id) {
      setEditingTask(null);
    }
  };

  // Move a task up or down in its original order.
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
        direction === "up" ? index - 1 : index + 1;

      // Prevent moving outside the list boundaries.
      if (
        index < 0 ||
        nextIndex < 0 ||
        nextIndex >= ordered.length
      ) {
        return previous;
      }

      // Swap the selected task with its neighbor.
      [ordered[index], ordered[nextIndex]] = [
        ordered[nextIndex],
        ordered[index],
      ];

      // Reassign order values after the swap.
      return ordered.map((task, position) => ({
        ...task,
        order: position,
      }));
    });
  };

  // Calculate dashboard statistics from the task array.
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
        <p>Stay organized and keep track of your progress.</p>
      </header>

      {/* Task statistics */}
      <section className="stats-grid">
        {[
          { label: "Total Tasks", value: tasks.length },
          { label: "Completed", value: completed },
          { label: "In Progress", value: inProgress },
          { label: "Pending", value: pending },
        ].map((stat) => (
          <div className="stat-card" key={stat.label}>
            <h2>{stat.label}</h2>
            <p>{stat.value}</p>
          </div>
        ))}
      </section>

      {/* Form for creating and editing tasks */}
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

      {/* Display the filtered task list */}
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
    </main>
  );
}

export default App;
