# Task Management Dashboard

A responsive task management application built with React, TypeScript, and Vite. The dashboard helps users create, organize, track, and manage tasks through an interactive interface.

## Features

### Task Management
- Create tasks with a title, description, status, priority, and due date
- Edit existing tasks
- Delete tasks
- Update task statuses
- View task statistics

### Search and Organization
- Search tasks
- Filter tasks by status
- Filter tasks by priority
- Sort by due date, priority, or title
- Manually reorder tasks using Up and Down controls

### Data Persistence
- Save tasks automatically using browser localStorage
- Restore saved tasks when the application reloads
- Export tasks to a JSON backup
- Import tasks from a valid JSON backup

### User Interface
- Responsive layout for desktop and mobile screens
- Light and dark themes
- Persistent theme preference
- Form validation and user feedback
- Accessible form labels and interactive controls

## Technologies Used

- React
- TypeScript
- Vite
- CSS
- Browser localStorage
- JSON

## Getting Started

### Prerequisites

Install Node.js and npm.

### Installation

1. Clone the repository:

   ```bash
   git clone YOUR_REPOSITORY_URL
   ```

2. Open the project directory:

   ```bash
   cd task-dashboard
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open the local URL displayed in the terminal.

## Production Build

Run:

```bash
npm run build
```

This command runs TypeScript checks and creates an optimized production build in the `dist` directory.

## Project Structure

```text
src/
├── components/
│   ├── Dashboard/
│   ├── TaskFilter/
│   ├── TaskForm/
│   ├── TaskItem/
│   └── TaskList/
├── types/
│   └── index.ts
├── utils/
│   └── taskUtils.ts
├── App.tsx
├── App.css
├── index.css
└── main.tsx
```

## How to Use

1. Enter task information in the task form.
2. Submit the form to create a task.
3. Use Edit to modify an existing task.
4. Change the status directly from the task card.
5. Use the search and filter controls to find tasks.
6. Select Manual Order to arrange tasks using Up and Down.
7. Use Export Tasks to download a backup.
8. Use Import Tasks to restore tasks from a backup.
9. Use the theme button to switch between light and dark mode.

## Data Storage

The application uses browser localStorage to save tasks and theme preferences between sessions. Users can also export their tasks as a JSON file and import a previously saved backup.

Because the application does not currently use a backend, task data is specific to the browser in which it was created.

## Known Limitations

- Task data does not automatically synchronize across browsers or devices.
- Importing a JSON backup replaces the existing task list.
- Manual task reordering uses Up and Down controls rather than drag-and-drop.

## Future Improvements

- User accounts with secure authentication
- Cloud-based task storage and synchronization
- Drag-and-drop reordering
- Task categories and due-date notifications

## Author

[Ebony Mitchell](https://github.com/ebonymitchell)

## Course

Per Scholas — React and TypeScript Task Management Dashboard SBA
