import type {
    Task,
    TaskFilters,
    TaskFormData,
    TaskPriority,
} from "../types";

/* Assign numerical values to priorities for sorting. */
const priorityValues: Record<TaskPriority, number> = {
    low: 1,
    medium: 2,
    high: 3,
};

/* Filter tasks by status, priority, and search text. */
export function filterTasks(tasks: Task[], filters: TaskFilters): Task[] {
    const search = filters.search.trim().toLowerCase();

    return tasks.filter((task) => {
        const matchesStatus =
            filters.status === "all" || task.status === filters.status;

        const matchesPriority =
            filters.priority === "all" || task.priority === filters.priority;

        const matchesSearch =
            task.title.toLowerCase().includes(search) ||
            task.description.toLowerCase().includes(search);

        return matchesStatus && matchesPriority && matchesSearch;
    });
}

/* Return a sorted copy without modifying React state. */
export function sortTasks(tasks: Task[], sortBy: TaskFilters["sortBy"]): Task[] {
    return [...tasks].sort((a, b) => {
        switch (sortBy) {
            case "dueDate-asc":
                return a.dueDate.localeCompare(b.dueDate);
            case "dueDate-desc":
                return b.dueDate.localeCompare(a.dueDate);
            case "priority-high":
                return priorityValues[b.priority] - priorityValues[a.priority];
            case "priority-low":
                return priorityValues[a.priority] - priorityValues[b.priority];
            case "title-asc":
                return a.title.localeCompare(b.title);
            default:
                return a.order - b.order;
        }
    });
}

/* Validate task form data and return field-specific errors. */
export function validateTask(
    data: TaskFormData
): Partial<Record<keyof TaskFormData, string>> {
    const errors: Partial<Record<keyof TaskFormData, string>> = {};

    if (!data.title.trim()) {
        errors.title = "A task title is required.";
    } else if (data.title.trim().length < 3) {
        errors.title = "The title must contain at least 3 characters.";
    }

    if (!data.description.trim()) {
        errors.description = "A description is required.";
    }

    if (!data.dueDate) {
        errors.dueDate = "Please select a due date.";
    }

    return errors;
}

/* Format a YYYY-MM-DD date for display. */
export function formatDate(date: string): string {
    if (!date) return "No due date";

    const parsed = new Date(`${date}T12:00:00`);

    if (Number.isNaN(parsed.getTime())) return "Invalid date";

    return parsed.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

/* Validate imported JSON before adding it to application state. */
export function isTaskArray(value: unknown): value is Task[] {
    if (!Array.isArray(value)) return false;

    return value.every((item: unknown) => {
        if (typeof item !== "object" || item === null) return false;

        const task = item as Record<string, unknown>;

        return (
            typeof task.id === "string" &&
            typeof task.title === "string" &&
            typeof task.description === "string" &&
            ["pending", "in-progress", "completed"].includes(
                String(task.status)
            ) &&
            ["low", "medium", "high"].includes(String(task.priority)) &&
            typeof task.dueDate === "string" &&
            typeof task.createdAt === "string" &&
            typeof task.order === "number" &&
            Number.isFinite(task.order)
        );
    });
}
