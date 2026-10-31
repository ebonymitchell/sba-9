# Task Management Dashboard - Reflection

### How I Implemented React and TypeScript

I used React to build the dashboard with reusable components for creating, editing, displaying, and organizing tasks. I used hooks like `useState`, `useEffect`, and `useMemo` to manage data and keep the dashboard updated.

TypeScript helped me define task types, component props, and function parameters. I also used localStorage to save tasks, added JSON import/export, and implemented light and dark modes.

### Challenges and How I Overcame Them

One of my biggest challenges was getting manual task reordering to work with the other sorting options. The buttons were changing the task order, but the changes weren't showing because the tasks were still sorted by due date. Adding a manual sorting option fixed that.

I also ran into TypeScript and JSX errors while updating components. I worked through them by reviewing my code, paying attention to error messages, and running builds to make sure everything compiled.

### Component Composition and State Management

I broke the application into smaller components so each one handles a specific part of the dashboard. I kept the main task data and state in `App.tsx` and passed information and functions to the other components through props.

I also separated filtering, sorting, and validation into utility functions to keep the code organized.

### Final Thoughts

### Final Thoughts

This project was challenging, especially when fixing one thing seemed to break something else. Working through those issues gave me a better understanding of how React components and state management work together. I still have a lot to learn, but I'm more comfortable figuring things out when something goes wrong.