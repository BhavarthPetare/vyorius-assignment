import { socket } from "../socket";

// CREATE
export const createTask = () => {
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

// UPDATE
export const updateTask = (task) => {
    socket.emit("task:update", task);
};

// MOVE
export const moveTask = (id, status) => {
    socket.emit("task:move", { id, status });
};

// DELETE
export const deleteTask = (id) => {
    socket.emit("task:delete", id);
};