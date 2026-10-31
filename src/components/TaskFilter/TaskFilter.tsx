import type {
  TaskFilterProps,
  TaskFilters,
} from "../../types";

// Provide controls for searching, filtering, and sorting tasks.
export default function TaskFilter({
  filters,
  onFilterChange,
}: TaskFilterProps) {
  // Update a single filter without changing the others.
  const updateFilter = <K extends keyof TaskFilters>(
    key: K,
    value: TaskFilters[K]
  ) => {
    onFilterChange({
      ...filters,
      [key]: value,
    });
  };

  // Reset search and category filters while preserving sorting.
  const clearFilters = () => {
    onFilterChange({
      status: "all",
      priority: "all",
      search: "",
      sortBy: filters.sortBy,
    });
  };

  return (
    <section className="filter-panel">
      <div className="filter-heading">
        <h2>Filter Tasks</h2>
        <span>Find and organize your tasks</span>
      </div>

      <div className="filter-grid">
        {/* Search task titles and descriptions. */}
        <div>
          <label htmlFor="task-search">Search</label>
          <input
            id="task-search"
            type="search"
            placeholder="Search tasks..."
            value={filters.search}
            onChange={(event) =>
              updateFilter("search", event.target.value)
            }
          />
        </div>

        {/* Filter by completion status. */}
        <div>
          <label htmlFor="status-filter">Status</label>
          <select
            id="status-filter"
            value={filters.status}
            onChange={(event) =>
              updateFilter(
                "status",
                event.target.value as TaskFilters["status"]
              )
            }
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Filter by priority. */}
        <div>
          <label htmlFor="priority-filter">Priority</label>
          <select
            id="priority-filter"
            value={filters.priority}
            onChange={(event) =>
              updateFilter(
                "priority",
                event.target.value as TaskFilters["priority"]
              )
            }
          >
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {/* Select how tasks are displayed. */}
        <div>
          <label htmlFor="sort-filter">Sort By</label>
          <select
            id="sort-filter"
            value={filters.sortBy}
            onChange={(event) =>
              updateFilter(
                "sortBy",
                event.target.value as TaskFilters["sortBy"]
              )
            }
          >
            <option value="manual">Manual Order</option>
            <option value="dueDate-asc">
              Due Date: Earliest First
            </option>
            <option value="dueDate-desc">
              Due Date: Latest First
            </option>
            <option value="priority-high">
              Priority: Highest First
            </option>
            <option value="priority-low">
              Priority: Lowest First
            </option>
            <option value="title-asc">
              Title: A to Z
            </option>
          </select>
        </div>
      </div>

      {/* Clear filters without resetting the sort selection. */}
      <button type="button" onClick={clearFilters}>
        Clear Filters
      </button>
    </section>
  );
}
