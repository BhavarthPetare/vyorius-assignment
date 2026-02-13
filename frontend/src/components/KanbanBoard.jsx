import React, { useEffect, useState } from "react";
import { socket } from "../socket";
import {
    createTask,
    updateTask,
    moveTask,
    deleteTask
} from "../services/taskService";

function KanbanBoard() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        priority: "Low",
        category: "Feature",
        status: "todo"
    });

    // SOCKET LISTENERS

    useEffect(() => {
        socket.on("sync:tasks", (serverTasks) => {
            setTasks(serverTasks);
            setLoading(false);
        });

        socket.on("task:created", (task) => {
            setTasks((prev) => [...prev, task]);
        });

        socket.on("task:updated", (updated) => {
            setTasks((prev) =>
                prev.map((t) => (t.id === updated.id ? updated : t))
            );
        });

        socket.on("task:moved", ({ id, status }) => {
            setTasks((prev) =>
                prev.map((t) =>
                    t.id === id ? { ...t, status } : t
                )
            );
        });

        socket.on("task:deleted", (id) => {
            setTasks((prev) =>
                prev.filter((t) => t.id !== id)
            );
        });

        return () => {
            socket.off("sync:tasks");
            socket.off("task:created");
            socket.off("task:updated");
            socket.off("task:moved");
            socket.off("task:deleted");
        };
    }, []);

    // HANDLERS

    const handleCreate = () => {
        createTask(formData);

        setFormData({
            title: "",
            description: "",
            priority: "Low",
            category: "Feature",
            status: "todo"
        });

        setShowModal(false);
    };

    const handleDelete = (id) => {
        deleteTask(id);
    };

    const handleMove = (id, newStatus) => {
        moveTask(id, newStatus);
    };

    const handleUpdate = (task) => {
        updateTask(task);
    };

    const getTasksByStatus = (status) =>
        tasks.filter((t) => t.status === status);

    if (loading) return <p>Loading board...</p>;

    return (
        <div style={{ padding: "20px" }}>

            <button onClick={() => setShowModal(true)}>
                + Create Task
            </button>

            {showModal && (
                <div style={{ marginTop: "20px" }}>
                    <input
                        placeholder="Title"
                        value={formData.title}
                        onChange={(e) =>
                            setFormData({ ...formData, title: e.target.value })
                        }
                    />
                    <button onClick={handleCreate}>
                        Save
                    </button>
                </div>
            )}

            <div style={{ display: "flex", gap: "20px", marginTop: "30px" }}>
                <Column
                    title="To Do"
                    tasks={getTasksByStatus("todo")}
                    onDelete={handleDelete}
                    onMove={handleMove}
                    onUpdate={handleUpdate}
                />
                <Column
                    title="In Progress"
                    tasks={getTasksByStatus("inprogress")}
                    onDelete={handleDelete}
                    onMove={handleMove}
                    onUpdate={handleUpdate}
                />
                <Column
                    title="Done"
                    tasks={getTasksByStatus("done")}
                    onDelete={handleDelete}
                    onMove={handleMove}
                    onUpdate={handleUpdate}
                />
            </div>
        </div>
    );
}


// TEMP COLUMN COMPONENT

function Column({ title, tasks, onDelete }) {
    return (
        <div style={{
            border: "1px solid #ccc",
            padding: "10px",
            width: "250px"
        }}>
            <h3>{title}</h3>

            {tasks.map((task) => (
                <div
                    key={task.id}
                    style={{
                        border: "1px solid #999",
                        padding: "8px",
                        marginBottom: "8px"
                    }}
                >
                    <strong>{task.title}</strong>
                    <br />
                    <button
                        onClick={() => onDelete(task.id)}
                        style={{ marginTop: "5px" }}
                    >
                        Delete
                    </button>
                </div>
            ))}
        </div>
    );
}

export default KanbanBoard;