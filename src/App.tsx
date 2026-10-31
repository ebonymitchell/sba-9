import { useState } from "react";
import type { Task, TaskStatus } from "./types";
import "./App.css";

// Sample tasks so we can test the application immediately.
const initialTasks: Task[] = [
  {
    id: "1",
    title: "Complete React Dashboard SBA",
    description: "Build the task management dashboard using React and TypeScript.",
    status: "in-progress",
    priority: "high",
    dueDate: "2026-10-31",
    createdAt: "2026-10-30",
    order: 0,
  },
  {
    id: "2",
    title: "Review TypeScript",
    description: "Practice interfaces, union types, and component props.",
    status: "pending",
    priority: "medium",
    dueDate: "2026-11-01",
    createdAt: "2026-10-30",
    order: 1,
  },
  {
    id: "3",
    title: "Push Project to GitHub",
    description: "Commit changes and push the finished dashboard.",
    status: "completed",
    priority: "low",
    dueDate: "2026-11-02",
    createdAt: "2026-10-30",
    order: 2,
  },
];

function App() {
  // React state stores the current list of tasks.
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  // Calculate dashboard statistics from the task array.
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  ).length;
  const inProgressTasks = tasks.filter(
    (task) => task.status === "in-progress"
  ).length;
  const pendingTasks = tasks.filter(
    (task) => task.status === "pending"
  ).length;

  // Update the status of the selected task.
  const handleStatusChange = (id: string, status: TaskStatus) => {
    setTasks((previousTasks) =>
      previousTasks.map((task) =>
        task.id === id ? { ...task, status } : task
      )
    );
  };

  // Remove a task without modifying the original array.
  const handleDelete = (id: string) => {
    setTasks((previousTasks) =>
      previousTasks.filter((task) => task.id !== id)
    );
  };

  return (
    <main className="app-container">
      {/* Dashboard heading */}
      <header className="app-header">
        <h1>Task Management Dashboard</h1>
        <p>Stay organized and keep track of your progress.</p>
      </header>

      {/* Dashboard statistics */}
      <section className="stats-grid">
        <div className="stat-card">
          <h2>Total Tasks</h2>
          <p>{totalTasks}</p>
        </div>

        <div className="stat-card">
          <h2>Completed</h2>
          <p>{completedTasks}</p>
        </div>

        <div className="stat-card">
          <h2>In Progress</h2>
          <p>{inProgressTasks}</p>
        </div>

        <div className="stat-card">
          <h2>Pending</h2>
          <p>{pendingTasks}</p>
        </div>
      </section>

      {/* Temporary task list for testing. */}
      <section className="task-section">
        <h2>Your Tasks</h2>

        {tasks.length === 0 ? (
          <p>No tasks available.</p>
        ) : (
          <div className="task-grid">
            {tasks.map((task) => (
              <article className="task-card" key={task.id}>
                <h3>{task.title}</h3>
                <p>{task.description}</p>

                <p>
                  Priority:{" "}
                  <span className={`priority-${task.priority}`}>
                    {task.priority}
                  </span>
                </p>

                <p>Due: {task.dueDate}</p>

                <label htmlFor={`status-${task.id}`}>
                  Status:
                </label>

                <select
                  id={`status-${task.id}`}
                  value={task.status}
                  onChange={(event) =>
                    handleStatusChange(
                      task.id,
                      event.target.value as TaskStatus
                    )
                  }
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>

                <button
                  type="button"
                  className="delete-button"
                  onClick={() => handleDelete(task.id)}
                >
                  Delete
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default App;
