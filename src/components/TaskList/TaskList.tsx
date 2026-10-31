import type { TaskListProps } from "../../types";
import TaskItem from "./TaskItem";

// Renders tasks with unique React keys.
export default function TaskList({
  tasks,
  onStatusChange,
  onEdit,
  onDelete,
  onMove,
}: TaskListProps) {
  if (tasks.length === 0) {
    return <p className="empty-message">No tasks match your filters.</p>;
  }

  return (
    <div className="task-grid">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onStatusChange={onStatusChange}
          onEdit={onEdit}
          onDelete={onDelete}
          onMove={onMove}
        />
      ))}
    </div>
  );
}
