import React, {useEffect, useState} from 'react';
import {socket} from '../socket';

function KanbanBoard() {
    // TODO: Implement state and WebSocket logic
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [newTask, setNewTask] = useState({
        title: "",
        description: "",
        priority: "Low",
        category: "Feature",
        status: "todo",
    });

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
                prev.map((t) => (t.id === id ? { ...t, status } : t))
            );
        });

        socket.on("task:deleted", (id) => {
            setTasks((prev) => prev.filter((t) => t.id !== id));
        });

        return () => {
            socket.off("sync:tasks");
            socket.off("task:created");
            socket.off("task:updated");
            socket.off("task:moved");
            socket.off("task:deleted");
        };
    }, []);

    const createTask = () => {
        const task = {
            id: Date.now().toString(),
            ...newTask,
        };

        socket.emit("task:create", task);

        // reset modal
        setNewTask({
            title: "",
            description: "",
            priority: "Low",
            category: "Feature",
            status: "todo"
        });
        setShowModal(false);
    };

    const getTasksByStatus = (status) =>
        tasks.filter((t) => t.status === status);

    if (loading) return <p>Loading board...</p>;

    return (
        <div style={{ display: "flex", gap: "20px", padding: "20px" }}>
            <Column title="To Do" tasks={getTasksByStatus("todo")} />
            <Column title="In Progress" tasks={getTasksByStatus("inprogress")} />
            <Column title="Done" tasks={getTasksByStatus("done")} />
        </div>
    );
}

function Column({ title, tasks }) {
    return (
        <div style={{ padding: "20px" }}>
            
            <button
                onClick={() => setShowModal(true)}
                style={{ marginBottom: "20px", padding: "10px 16px" }}
            >
                + Create Task
            </button>

            {showModal && (
                <div style={{
                    position: "fixed",
                    top: 0, left: 0,
                    width: "100vw", height: "100vh",
                    background: "rgba(0,0,0,0.3)",
                    display: "flex", justifyContent: "center",
                    alignItems: "center"
                }}>
                    <div style={{
                        background: "#fff",
                        padding: "20px",
                        width: "350px",
                        borderRadius: "8px"
                    }}>
                        <h3>Create New Task</h3>

                        <input
                            type="text"
                            placeholder="Title"
                            value={newTask.title}
                            onChange={(e) =>
                                setNewTask({ ...newTask, title: e.target.value })
                            }
                            style={{ width: "100%", marginBottom: "10px" }}
                        />

                        <textarea
                            placeholder="Description"
                            value={newTask.description}
                            onChange={(e) =>
                                setNewTask({ ...newTask, description: e.target.value })
                            }
                            style={{ width: "100%", marginBottom: "10px" }}
                        />

                        <label>Priority:</label>
                        <select
                            value={newTask.priority}
                            onChange={(e) =>
                                setNewTask({ ...newTask, priority: e.target.value })
                            }
                            style={{ width: "100%", marginBottom: "10px" }}
                        >
                            <option>Low</option>
                            <option>Medium</option>
                            <option>High</option>
                        </select>

                        <label>Category:</label>
                        <select
                            value={newTask.category}
                            onChange={(e) =>
                                setNewTask({ ...newTask, category: e.target.value })
                            }
                            style={{ width: "100%", marginBottom: "10px" }}
                        >
                            <option>Feature</option>
                            <option>Bug</option>
                            <option>Enhancement</option>
                        </select>

                        <button onClick={createTask}>Create</button>
                        <button onClick={() => setShowModal(false)} style={{ marginLeft: "10px" }}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}
            <div style={{ border: "1px solid #ccc", padding: "10px", width: "250px" }}>
                <h3>{title}</h3>
                {tasks.length === 0 ? <p>No tasks</p> : null}
                {tasks.map((t) => (
                    <div key={t.id} style={{ padding: "8px", border: "1px solid #aaa", marginBottom: "10px" }}>
                        <strong>{t.title}</strong>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default KanbanBoard;
