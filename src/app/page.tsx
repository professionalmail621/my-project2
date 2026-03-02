"use client";

import { useState, useMemo } from "react";
import { getTasks } from "@/lib/tasks";
import { Task } from "@/types/tasks";
import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>(getTasks());
  const [searchQuery, setSearchQuery] = useState("");

  // Filter tasks based on search query
  const filteredTasks = useMemo(() => {
    if (!searchQuery.trim()) return tasks;
    return tasks.filter((task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [tasks, searchQuery]);

  // Calculate task statistics
  const completedCount = tasks.filter((task) => task.status === "done").length;
  const totalCount = tasks.length;

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        fontFamily: "sans-serif",
        padding: "20px",
      }}
    >
      <main
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          backgroundColor: "white",
          borderRadius: "8px",
          padding: "30px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <h1
          style={{
            fontSize: "32px",
            fontWeight: "bold",
            marginBottom: "30px",
            color: "#1565C0",
            textAlign: "center",
          }}
        >
          Task Tracker
        </h1>

        <TaskForm onTaskAdded={() => setTasks(getTasks())} />

        {/* Task Counter */}
        <div
          style={{
            backgroundColor: "#E3F2FD",
            padding: "15px 20px",
            borderRadius: "8px",
            marginBottom: "20px",
            textAlign: "center",
            border: "1px solid #90CAF9",
          }}
        >
          <span
            style={{
              fontSize: "18px",
              fontWeight: "600",
              color: "#1565C0",
            }}
          >
            {completedCount} of {totalCount} tasks completed
          </span>
        </div>

        {/* Search/Filter Bar */}
        <div style={{ marginBottom: "20px" }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks by title..."
            style={{
              width: "100%",
              padding: "12px 16px",
              border: "2px solid #e0e0e0",
              borderRadius: "8px",
              fontSize: "16px",
              boxSizing: "border-box",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#1565C0")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#e0e0e0")}
          />
          {searchQuery && (
            <p
              style={{
                marginTop: "8px",
                fontSize: "14px",
                color: "#666",
              }}
            >
              Showing {filteredTasks.length} of {totalCount} tasks
            </p>
          )}
        </div>

        <TaskList
          tasks={filteredTasks}
          onTasksChange={() => setTasks(getTasks())}
        />
      </main>
    </div>
  );
}
