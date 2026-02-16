import { useEffect, useState } from "react";
import {DndContext, closestCorners, DragOverlay, useSensor, useSensors, PointerSensor} from '@dnd-kit/core';

import { socket } from "../socket";
import Column from "./Column";
import ProgressChart from "./ProgressChart";
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

    const [activeState, setActiveState] = useState(null);
    const sensors = useSensors(
      useSensor(PointerSensor, {
        activationConstraint: {
          distance: 8,
        },
      })
    );

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

        // Request tasks after listeners are set up to avoid race condition
        socket.emit("request:tasks");

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
        if (!formData.title.trim()) return;
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

    const handleDragStart = (e) => {
      const { active } = e;
      const task = tasks.find((t) => t.id === active.id);
      setActiveState(task);
    };
    const handleDragEnd = (e) => {
        const { active, over } = e;

        if (!over) {
          setActiveState(null);
          return
        };

        const taskId = active.id;
        const newStatus = over.id;

        const task = tasks.find((t) => t.id === taskId);
        if (!task) return

        if (task.status !== newStatus) {
            moveTask(taskId, newStatus);
        }
        setActiveState(null);
    }

    const handleUpdate = (task) => {
        updateTask(task);
    };

    const getTasksByStatus = (status) =>
        tasks.filter((t) => t.status === status);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen text-gray-500">
                Loading board...
            </div>
        );
    };

    return (
    <div className="min-h-screen bg-gray-100 p-8">

      {/* Header */}
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
            Kanban Board
            </h1>

            <button
            onClick={() => setShowModal(true)}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
            + Create Task
            </button>
        </div>
        <ProgressChart tasks={tasks}/>
        <DndContext
          sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="flex gap-6">
                <Column
                    title="To Do"
                    status="todo"
                    tasks={getTasksByStatus("todo")}
                    onUpdate={handleUpdate}
                    onDelete={handleDelete}
                />

                <Column
                    title="In Progress"
                    status="inprogress"
                    tasks={getTasksByStatus("inprogress")}
                    onUpdate={handleUpdate}
                    onDelete={handleDelete}
                />

                <Column
                    title="Done"
                    status="done"
                    tasks={getTasksByStatus("done")}
                    onUpdate={handleUpdate}
                    onDelete={handleDelete}
                />
            </div>
            <DragOverlay dropAnimation={null}>
              {activeState ? (
                <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-4 w-72 scale-105">
                  <h4 className="font-semibold text-gray-800">
                    {activeState.title}
                  </h4>
                </div>
              ) : null}
            </DragOverlay>
        </DndContext>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 w-96 shadow-lg space-y-4">

            <h2 className="text-xl font-semibold text-gray-800">
              Create New Task
            </h2>

            <input
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              placeholder="Task Title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />

            <textarea
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              placeholder="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />

            <select
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              value={formData.priority}
              onChange={(e) =>
                setFormData({ ...formData, priority: e.target.value })
              }
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>

            <select
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
            >
              <option value="todo">To Do</option>
              <option value="inprogress">In Progress</option>
              <option value="done">Done</option>
            </select>

            <div className="flex justify-end gap-3 pt-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleCreate}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default KanbanBoard;