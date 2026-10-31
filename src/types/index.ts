import type { ReactNode } from "react";

// Allowed task statuses.
export type TaskStatus =
    | "pending"
    | "in-progress"
    | "completed";

// Allowed priority levels.
export type TaskPriority = "low" | "medium" | "high";

// Available task sorting methods.
export type SortOption =
    | "manual"
    | "dueDate-asc"
    | "dueDate-desc"
    | "priority-high"
    | "priority-low"
    | "title-asc";

// Main task data structure.
export interface Task {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate: string;
    createdAt: string;
    order: number;
}

// Fields entered through the task form.
export type TaskFormData = Pick<
    Task,
    "title" | "description" | "status" | "priority" | "dueDate"
>;

// Current search, filter, and sorting settings.
export interface TaskFilters {
    status: TaskStatus | "all";
    priority: TaskPriority | "all";
    search: string;
    sortBy: SortOption;
}

// Props for an individual task card.
export interface TaskItemProps {
    task: Task;
    onStatusChange: (
        id: string,
        status: TaskStatus
    ) => void;
    onEdit: (task: Task) => void;
    onDelete: (id: string) => void;
    onMove: (
        id: string,
        direction: "up" | "down"
    ) => void;
}

// Props for the task list.
export interface TaskListProps {
    tasks: Task[];
    onStatusChange: TaskItemProps["onStatusChange"];
    onEdit: TaskItemProps["onEdit"];
    onDelete: TaskItemProps["onDelete"];
    onMove: TaskItemProps["onMove"];
}

// Props for the task creation and editing form.
export interface TaskFormProps {
    editingTask: Task | null;
    onSubmit: (data: TaskFormData) => void;
    onCancel: () => void;
}

// Props for task search, filtering, and sorting.
export interface TaskFilterProps {
    filters: TaskFilters;
    onFilterChange: (filters: TaskFilters) => void;
}

// Shared dashboard layout props.
export interface DashboardProps {
    tasks: Task[];
    children: ReactNode;
}
