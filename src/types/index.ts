/* The allowed values for a task's status and priority. */
export type TaskStatus = "pending" | "in-progress" | "completed";
export type TaskPriority = "low" | "medium" | "high";

/* The different ways tasks can be sorted. */
export type SortOption =
    | "dueDate-asc"
    | "dueDate-desc"
    | "priority-high"
    | "priority-low"
    | "title-asc";

/* The data structure for a task. */
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

/* Data entered into the task creation/editing form. */
export type TaskFormData = Pick<
    Task,
    "title" | "description" | "status" | "priority" | "dueDate"
>;

/* Search and filtering options. */
export interface TaskFilters {
    status: TaskStatus | "all";
    priority: TaskPriority | "all";
    search: string;
    sortBy: SortOption;
}

/* Component props keep data flowing between components. */
export interface TaskItemProps {
    task: Task;
    onStatusChange: (id: string, status: TaskStatus) => void;
    onEdit: (task: Task) => void;
    onDelete: (id: string) => void;
    onMove: (id: string, direction: "up" | "down") => void;
}

export interface TaskListProps {
    tasks: Task[];
    onStatusChange: TaskItemProps["onStatusChange"];
    onEdit: TaskItemProps["onEdit"];
    onDelete: TaskItemProps["onDelete"];
    onMove: TaskItemProps["onMove"];
}

export interface TaskFormProps {
    editingTask: Task | null;
    onSubmit: (data: TaskFormData) => void;
    onCancel: () => void;
}

export interface TaskFilterProps {
    filters: TaskFilters;
    onFilterChange: (filters: TaskFilters) => void;
}

export interface DashboardProps {
    tasks: Task[];
    children: React.ReactNode;
}
