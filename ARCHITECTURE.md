# Task Tracker - Architecture Documentation

## Project Overview

Task Tracker is a Next.js 16 application built with React 19, TypeScript, and Tailwind CSS. It provides a simple yet effective interface for managing tasks with features like task creation, status tracking, priority management, and search functionality.

## Technology Stack

- **Framework**: Next.js 16.1.6 (App Router)
- **UI Library**: React 19.2.3
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **State Management**: React Hooks (useState, useMemo)
- **Data Persistence**: Browser localStorage

## Project Structure

```
task-tracker/
├── .kilocode/              # Kilocode configuration
├── screenshots/            # Application screenshots
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── favicon.ico
│   │   ├── globals.css    # Global styles
│   │   ├── layout.tsx     # Root layout component
│   │   └── page.tsx       # Home page (main app entry)
│   ├── components/        # React components
│   │   ├── TaskForm.tsx   # Task creation form
│   │   └── TaskList.tsx   # Task list display
│   ├── lib/               # Business logic & utilities
│   │   └── tasks.ts       # Task CRUD operations
│   └── types/             # TypeScript type definitions
│       └── tasks.ts       # Task interface
├── .gitignore
├── next.config.ts         # Next.js configuration
├── package.json
├── postcss.config.mjs     # PostCSS configuration
├── README.md
└── tsconfig.json          # TypeScript configuration
```

## Component Architecture

### 1. Page Component (`src/app/page.tsx`)

**Purpose**: Main application entry point and state container

**Responsibilities**:
- Manages global task state using `useState`
- Handles search/filter functionality with `useMemo` for performance
- Calculates task statistics (completed vs total)
- Renders the main UI layout
- Coordinates between TaskForm and TaskList components

**Key Features**:
- Client-side component (`"use client"`)
- Search functionality with real-time filtering
- Task completion counter
- Responsive layout with centered container

**State**:
```typescript
const [tasks, setTasks] = useState<Task[]>(getTasks());
const [searchQuery, setSearchQuery] = useState("");
```

### 2. TaskForm Component (`src/components/TaskForm.tsx`)

**Purpose**: Form for creating new tasks

**Props**:
```typescript
interface TaskFormProps {
  onTaskAdded: () => void;  // Callback to refresh task list
}
```

**Responsibilities**:
- Collects task input (title, description, priority)
- Validates required fields
- Calls `addTask()` from lib/tasks
- Resets form after submission
- Triggers parent refresh via callback

**State**:
```typescript
const [title, setTitle] = useState("");
const [description, setDescription] = useState("");
const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
```

**Form Fields**:
- **Title** (required): Text input
- **Description** (optional): Textarea
- **Priority** (required): Select dropdown (low/medium/high)

### 3. TaskList Component (`src/components/TaskList.tsx`)

**Purpose**: Displays and manages task list

**Props**:
```typescript
interface TaskListProps {
  tasks: Task[];              // Filtered task array
  onTasksChange: () => void;  // Callback to refresh task list
}
```

**Responsibilities**:
- Renders individual task cards
- Provides status change buttons (todo/in-progress/done)
- Handles task deletion
- Visual indicators for status and priority
- Empty state messaging

**Key Functions**:
- `handleDelete(id)`: Deletes task and triggers refresh
- `handleStatusChange(id, status)`: Updates task status
- `getStatusColor(status)`: Returns color for status badge
- `getPriorityColor(priority)`: Returns color for priority badge

**Visual Design**:
- Color-coded status badges (gray/blue/green)
- Color-coded priority badges (red/orange/green)
- Conditional status buttons (only show available transitions)
- Hover effects on interactive elements

## Data Layer

### Task Type (`src/types/tasks.ts`)

```typescript
export interface Task {
  id: string;                                    // Unique identifier
  title: string;                                 // Task title
  description: string;                           // Task description
  status: "todo" | "in-progress" | "done";      // Current status
  priority: "low" | "medium" | "high";          // Priority level
  createdAt: Date;                              // Creation timestamp
}
```

### Task Operations (`src/lib/tasks.ts`)

**Storage Strategy**:
- In-memory array for runtime operations
- localStorage for persistence
- Automatic initialization with default tasks

**Core Functions**:

1. **`getTasks(): Task[]`**
   - Returns all tasks
   - Initializes from localStorage on first call
   - Handles SSR safety checks

2. **`addTask(task: Omit<Task, "id" | "createdAt">): Task`**
   - Creates new task with generated ID and timestamp
   - Adds to in-memory array
   - Persists to localStorage
   - Returns created task

3. **`updateTaskStatus(id: string, status: Task["status"]): Task | undefined`**
   - Finds task by ID
   - Updates status
   - Persists changes
   - Returns updated task or undefined

4. **`deleteTask(id: string): boolean`**
   - Filters out task by ID
   - Persists changes
   - Returns success boolean

**Helper Functions**:
- `initializeTasks()`: Loads from localStorage or creates defaults
- `getDefaultTasks()`: Returns initial demo tasks
- `saveTasks()`: Persists to localStorage

## Data Flow

### 1. Application Initialization

```
User loads page
    ↓
page.tsx renders
    ↓
useState calls getTasks()
    ↓
tasks.ts initializes from localStorage
    ↓
If no data: load default tasks
    ↓
Tasks rendered in UI
```

### 2. Creating a Task

```
User fills TaskForm
    ↓
User clicks "Add Task"
    ↓
TaskForm.handleSubmit()
    ↓
addTask() in lib/tasks
    ↓
Task added to array + localStorage
    ↓
onTaskAdded() callback
    ↓
page.tsx calls setTasks(getTasks())
    ↓
UI re-renders with new task
```

### 3. Updating Task Status

```
User clicks status button
    ↓
TaskList.handleStatusChange()
    ↓
updateTaskStatus() in lib/tasks
    ↓
Task status updated + persisted
    ↓
onTasksChange() callback
    ↓
page.tsx calls setTasks(getTasks())
    ↓
UI re-renders with updated status
```

### 4. Deleting a Task

```
User clicks "Delete"
    ↓
TaskList.handleDelete()
    ↓
deleteTask() in lib/tasks
    ↓
Task removed + persisted
    ↓
onTasksChange() callback
    ↓
page.tsx calls setTasks(getTasks())
    ↓
UI re-renders without deleted task
```

### 5. Searching Tasks

```
User types in search input
    ↓
page.tsx updates searchQuery state
    ↓
useMemo recalculates filteredTasks
    ↓
TaskList receives filtered array
    ↓
UI shows matching tasks only
```

## State Management Pattern

The application uses a **unidirectional data flow** pattern:

1. **Single Source of Truth**: `page.tsx` holds the task state
2. **Props Down**: Data flows down to child components via props
3. **Events Up**: Child components notify parent via callbacks
4. **Immutable Updates**: State updates trigger re-renders
5. **Memoization**: `useMemo` optimizes filtering performance

## Styling Approach

- **Inline Styles**: All components use inline React styles
- **No CSS Modules**: Direct style objects for simplicity
- **Tailwind CSS**: Configured but minimal usage (primarily globals.css)
- **Responsive Design**: Max-width container with centered layout
- **Color Scheme**: Blue primary (#1565C0), semantic status colors

## Performance Considerations

1. **Memoization**: `useMemo` for filtered tasks prevents unnecessary recalculations
2. **Controlled Components**: Form inputs use controlled component pattern
3. **Event Handlers**: Inline handlers with proper cleanup
4. **localStorage**: Synchronous but acceptable for small datasets
5. **Client-Side Only**: All state management happens in browser

## Future Enhancement Opportunities

1. **Backend Integration**: Replace localStorage with API calls
2. **Task Editing**: Add ability to edit existing tasks
3. **Due Dates**: Add deadline tracking
4. **Categories/Tags**: Organize tasks by category
5. **Drag & Drop**: Reorder tasks or change status via drag
6. **Filtering**: Filter by status, priority, or date
7. **Sorting**: Sort by various criteria
8. **Dark Mode**: Theme toggle
9. **Animations**: Smooth transitions for status changes
10. **Accessibility**: ARIA labels and keyboard navigation

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Browser Compatibility

- Modern browsers with localStorage support
- ES6+ JavaScript features
- React 19 compatible browsers
