import { socket } from "../socket";

// CREATE
export const createTask = (task) => {
    socket.emit("task:create", task);
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