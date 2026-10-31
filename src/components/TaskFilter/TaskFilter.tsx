import type {
  TaskFilterProps,
  TaskPriority,
  TaskStatus,
  SortOption,
} from "../../types";

// Controlled filters keep App in charge of filter state.
export default function TaskFilter({
  filters,
  onFilterChange,
}: TaskFilterProps) {
  const activeCount = [
    filters.status !== "all",
    filters.priority !== "all",
    filters.search.trim() !== "",
  ].filter(Boolean).length;

  return (
    <section className="filter-panel">
      <div className="filter-heading">
        <h2>Find Tasks</h2>
        <span>{activeCount} active filters</span>
      </div>

      <div className="filter-grid">
        <div>
          <label htmlFor="task-search">Search</label>
          <input
            id="task-search"
            type="search"
            placeholder="Search tasks..."
            value={filters.search}
            onChange={(event) =>
              onFilterChange({ ...filters, search: event.target.value })
            }
          />
        </div>

        <div>
          <label htmlFor="filter-status">Status</label>
          <select
            id="filter-status"
            value={filters.status}
            onChange={(event) =>
              onFilterChange({
                ...filters,
                status: event.target.value as TaskStatus | "all",
              })
            }
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div>
          <label htmlFor="filter-priority">Priority</label>
          <select
            id="filter-priority"
            value={filters.priority}
            onChange={(event) =>
              onFilterChange({
                ...filters,
                priority: event.target.value as TaskPriority | "all",
              })
            }
          >
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label htmlFor="task-sort">Sort By</label>
          <select
            id="task-sort"
            value={filters.sortBy}
            onChange={(event) =>
              onFilterChange({
                ...filters,
                sortBy: event.target.value as SortOption,
              })
            }
          >
            <option value="dueDate-asc">Due Date: Earliest</option>
            <option value="dueDate-desc">Due Date: Latest</option>
            <option value="priority-high">Priority: Highest</option>
            <option value="priority-low">Priority: Lowest</option>
            <option value="title-asc">Title: A–Z</option>
          </select>
        </div>
      </div>

      {activeCount > 0 && (
        <button
          type="button"
          onClick={() =>
            onFilterChange({
              ...filters,
              status: "all",
              priority: "all",
              search: "",
            })
          }
        >
          Clear Filters
        </button>
      )}
    </section>
  );
}
