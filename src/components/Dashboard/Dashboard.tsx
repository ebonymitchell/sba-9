import type { ReactNode } from "react";
import type { Task } from "../../types";

// Define the data and callbacks required by the dashboard.
interface DashboardProps {
  tasks: Task[];
  theme: "light" | "dark";
  onThemeToggle: () => void;
  children: ReactNode;
}

// Display the dashboard header, statistics, and child components.
export default function Dashboard({
  tasks,
  theme,
  onThemeToggle,
  children,
}: DashboardProps) {
  // Calculate statistics using all tasks, regardless of filters.
  const completed = tasks.filter(
    (task) => task.status === "completed"
  ).length;

  const inProgress = tasks.filter(
    (task) => task.status === "in-progress"
  ).length;

  const pending = tasks.filter(
    (task) => task.status === "pending"
  ).length;

  const statistics = [
    { label: "Total Tasks", value: tasks.length },
    { label: "Completed", value: completed },
    { label: "In Progress", value: inProgress },
    { label: "Pending", value: pending },
  ];

  return (
    <main className="app-container">
      {/* Dashboard heading and theme toggle */}
      <header className="app-header">
        <div className="theme-controls">
          <button
            type="button"
            className="theme-toggle"
            onClick={onThemeToggle}
            aria-label={`Switch to ${
              theme === "light" ? "dark" : "light"
            } mode`}
            aria-pressed={theme === "dark"}
          >
            {theme === "light" ? "Dark Mode" : "Light Mode"}
          </button>
        </div>

        <h1>Task Management Dashboard</h1>
        <p>
          Stay organized and keep track of your progress.
        </p>
      </header>

      {/* Task statistics update automatically when tasks change. */}
      <section
        className="stats-grid"
        aria-label="Task statistics"
      >
        {statistics.map((stat) => (
          <div className="stat-card" key={stat.label}>
            <h2>{stat.label}</h2>
            <p>{stat.value}</p>
          </div>
        ))}
      </section>

      {/* Render task forms, filters, and lists from App. */}
      {children}
    </main>
  );
}
