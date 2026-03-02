import { useState } from "react";
import { addTask } from "@/lib/tasks";

interface TaskFormProps {
  onTaskAdded: () => void;
}

export default function TaskForm({ onTaskAdded }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addTask({
      title,
      description,
      priority,
      status: "todo",
    });

    onTaskAdded();
    setTitle("");
    setDescription("");
    setPriority("medium");
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        backgroundColor: "#f9f9f9",
        padding: "20px",
        borderRadius: "8px",
        marginBottom: "30px",
        border: "1px solid #e0e0e0",
      }}
    >
      <div style={{ marginBottom: "15px" }}>
        <label
          htmlFor="title"
          style={{
            display: "block",
            marginBottom: "5px",
            fontWeight: "600",
            color: "#333",
          }}
        >
          Title *
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "4px",
            fontSize: "16px",
            boxSizing: "border-box",
          }}
          placeholder="Enter task title"
        />
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label
          htmlFor="description"
          style={{
            display: "block",
            marginBottom: "5px",
            fontWeight: "600",
            color: "#333",
          }}
        >
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "4px",
            fontSize: "16px",
            minHeight: "80px",
            resize: "vertical",
            boxSizing: "border-box",
          }}
          placeholder="Enter task description"
        />
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label
          htmlFor="priority"
          style={{
            display: "block",
            marginBottom: "5px",
            fontWeight: "600",
            color: "#333",
          }}
        >
          Priority
        </label>
        <select
          id="priority"
          value={priority}
          onChange={(e) =>
            setPriority(e.target.value as "low" | "medium" | "high")
          }
          style={{
            width: "100%",
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "4px",
            fontSize: "16px",
            backgroundColor: "white",
            boxSizing: "border-box",
          }}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <button
        type="submit"
        style={{
          backgroundColor: "#1565C0",
          color: "white",
          padding: "12px 24px",
          border: "none",
          borderRadius: "4px",
          fontSize: "16px",
          fontWeight: "600",
          cursor: "pointer",
          transition: "background-color 0.2s",
        }}
        onMouseOver={(e) =>
          (e.currentTarget.style.backgroundColor = "#0D47A1")
        }
        onMouseOut={(e) =>
          (e.currentTarget.style.backgroundColor = "#1565C0")
        }
      >
        Add Task
      </button>
    </form>
  );
}