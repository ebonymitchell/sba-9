import type { TaskItemProps, TaskStatus } from "../../types";
import { formatDate } from "../../utils/taskUtils";

// Displays one task and its available actions.
export default function TaskItem({
  task,
  onStatusChange,
  onEdit,
  onDelete,
  onMove,
}: TaskItemProps) {
  return (
    <article className="task-card">
      <div className="task-card-header">
        <h3>{task.title}</h3>
        <span className={`priority-${task.priority}`}>
          {task.priority} priority
        </span>
      </div>

      <p>{task.description}</p>
      <p>Due: {formatDate(task.dueDate)}</p>

      <label htmlFor={`status-${task.id}`}>Status</label>
      <select
        id={`status-${task.id}`}
        value={task.status}
        onChange={(event) =>
          onStatusChange(task.id, event.target.value as TaskStatus)
        }
      >
        <option value="pending">Pending</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>

      <div className="task-actions">
        <button type="button" onClick={() => onEdit(task)}>
          Edit
        </button>
        <button
          type="button"
          className="delete-button"
          onClick={() => onDelete(task.id)}
        >
          Delete
        </button>
        <button type="button" onClick={() => onMove(task.id, "up")}>
          ↑
        </button>
        <button type="button" onClick={() => onMove(task.id, "down")}>
          ↓
        </button>
      </div>
    </article>
  );
}
