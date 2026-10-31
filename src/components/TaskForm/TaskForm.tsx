import { useEffect, useState } from "react";
import type {
  TaskFormData,
  TaskFormProps,
  TaskPriority,
  TaskStatus,
} from "../../types";
import { validateTask } from "../../utils/taskUtils";

const emptyForm: TaskFormData = {
  title: "",
  description: "",
  status: "pending",
  priority: "medium",
  dueDate: "",
};

// Controlled form supports creating and editing tasks.
export default function TaskForm({
  editingTask,
  onSubmit,
  onCancel,
}: TaskFormProps) {
  const [form, setForm] = useState<TaskFormData>(emptyForm);
  const [errors, setErrors] = useState<
    Partial<Record<keyof TaskFormData, string>>
  >({});

  // Load existing values when editing a task.
  useEffect(() => {
    if (editingTask) {
      setForm({
        title: editingTask.title,
        description: editingTask.description,
        status: editingTask.status,
        priority: editingTask.priority,
        dueDate: editingTask.dueDate,
      });
    } else {
      setForm({ ...emptyForm });
    }

    setErrors({});
  }, [editingTask]);

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors = validateTask(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    onSubmit({
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
    });

    if (!editingTask) {
      setForm({ ...emptyForm });
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit} noValidate>
      <h2>{editingTask ? "Edit Task" : "Add New Task"}</h2>

      <label htmlFor="task-title">Task Title</label>
      <input
        id="task-title"
        value={form.title}
        onChange={(event) =>
          setForm({ ...form, title: event.target.value })
        }
        aria-invalid={Boolean(errors.title)}
      />
      {errors.title && <p className="form-error">{errors.title}</p>}

      <label htmlFor="task-description">Description</label>
      <textarea
        id="task-description"
        value={form.description}
        onChange={(event) =>
          setForm({ ...form, description: event.target.value })
        }
        aria-invalid={Boolean(errors.description)}
      />
      {errors.description && (
        <p className="form-error">{errors.description}</p>
      )}

      <div className="form-row">
        <div>
          <label htmlFor="task-priority">Priority</label>
          <select
            id="task-priority"
            value={form.priority}
            onChange={(event) =>
              setForm({
                ...form,
                priority: event.target.value as TaskPriority,
              })
            }
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label htmlFor="task-status">Status</label>
          <select
            id="task-status"
            value={form.status}
            onChange={(event) =>
              setForm({
                ...form,
                status: event.target.value as TaskStatus,
              })
            }
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      <label htmlFor="task-due-date">Due Date</label>
      <input
        id="task-due-date"
        type="date"
        value={form.dueDate}
        onChange={(event) =>
          setForm({ ...form, dueDate: event.target.value })
        }
        aria-invalid={Boolean(errors.dueDate)}
      />
      {errors.dueDate && <p className="form-error">{errors.dueDate}</p>}

      <div className="form-actions">
        <button type="submit">
          {editingTask ? "Save Changes" : "Add Task"}
        </button>

        {editingTask && (
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
