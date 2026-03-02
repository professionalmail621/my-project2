import { Task } from "@/types/tasks";
import { deleteTask, updateTaskStatus } from "@/lib/tasks";

interface TaskListProps {
  tasks: Task[];
  onTasksChange: () => void;
}

export default function TaskList({ tasks, onTasksChange }: TaskListProps) {
  const handleDelete = (id: string) => {
    deleteTask(id);
    onTasksChange();
  };

  const handleStatusChange = (id: string, status: Task["status"]) => {
    updateTaskStatus(id, status);
    onTasksChange();
  };

  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "todo":
        return "#9E9E9E";
      case "in-progress":
        return "#1565C0";
      case "done":
        return "#4CAF50";
      default:
        return "#757575";
    }
  };

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "high":
        return "#F44336";
      case "medium":
        return "#FF9800";
      case "low":
        return "#4CAF50";
      default:
        return "#757575";
    }
  };

  return (
    <div>
      {tasks.length === 0 ? (
        <p
          style={{
            textAlign: "center",
            color: "#757575",
            padding: "40px",
            fontSize: "18px",
          }}
        >
          No tasks yet. Add your first task above!
        </p>
      ) : (
        tasks.map((task) => (
          <div
            key={task.id}
            style={{
              backgroundColor: "white",
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
              padding: "20px",
              marginBottom: "15px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "10px",
              }}
            >
              <h3
                style={{
                  fontSize: "20px",
                  fontWeight: "600",
                  color: "#333",
                  margin: 0,
                }}
              >
                {task.title}
              </h3>
              <div style={{ display: "flex", gap: "8px" }}>
                <span
                  style={{
                    backgroundColor: getStatusColor(task.status),
                    color: "white",
                    padding: "4px 12px",
                    borderRadius: "12px",
                    fontSize: "12px",
                    fontWeight: "600",
                  }}
                >
                  {task.status}
                </span>
                <span
                  style={{
                    backgroundColor: getPriorityColor(task.priority),
                    color: "white",
                    padding: "4px 12px",
                    borderRadius: "12px",
                    fontSize: "12px",
                    fontWeight: "600",
                  }}
                >
                  {task.priority}
                </span>
              </div>
            </div>

            {task.description && (
              <p
                style={{
                  color: "#666",
                  marginBottom: "15px",
                  lineHeight: "1.5",
                }}
              >
                {task.description}
              </p>
            )}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", gap: "8px" }}>
                {task.status !== "todo" && (
                  <button
                    onClick={() => handleStatusChange(task.id, "todo")}
                    style={{
                      padding: "6px 12px",
                      border: "1px solid #9E9E9E",
                      backgroundColor: "transparent",
                      borderRadius: "4px",
                      fontSize: "14px",
                      cursor: "pointer",
                      color: "#9E9E9E",
                    }}
                  >
                    Set Todo
                  </button>
                )}
                {task.status !== "in-progress" && (
                  <button
                    onClick={() =>
                      handleStatusChange(task.id, "in-progress")
                    }
                    style={{
                      padding: "6px 12px",
                      border: "1px solid #1565C0",
                      backgroundColor: "transparent",
                      borderRadius: "4px",
                      fontSize: "14px",
                      cursor: "pointer",
                      color: "#1565C0",
                    }}
                  >
                    Set In Progress
                  </button>
                )}
                {task.status !== "done" && (
                  <button
                    onClick={() => handleStatusChange(task.id, "done")}
                    style={{
                      padding: "6px 12px",
                      border: "1px solid #4CAF50",
                      backgroundColor: "transparent",
                      borderRadius: "4px",
                      fontSize: "14px",
                      cursor: "pointer",
                      color: "#4CAF50",
                    }}
                  >
                    Set Done
                  </button>
                )}
              </div>

              <button
                onClick={() => handleDelete(task.id)}
                style={{
                  padding: "6px 12px",
                  backgroundColor: "#F44336",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = "#D32F2F")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = "#F44336")
                }
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}