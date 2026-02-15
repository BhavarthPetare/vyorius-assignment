import { socket } from "../socket";

// CREATE TASK
export const createTask = (taskData) => {
    if (!taskData?.title?.trim()) {
        console.error("createTask: Title is required");
        return;
    }

    const task = {
        id: Date.now().toString(),
        title: taskData.title.trim(),
        description: taskData.description || "",
        priority: taskData.priority || "Low",
        category: taskData.category || "Feature",
        status: taskData.status || "todo",
        attachments: taskData.attachments || [],
    };

    socket.emit("task:create", task);
};



// UPDATE TASK

export const updateTask = (updatedTask) => {
    if (!updatedTask?.id) {
        console.error("updateTask: Task ID missing");
        return;
    }

    socket.emit("task:update", updatedTask);
};


/**
 * MOVE TASK
 * Only sends minimal payload needed
 */
export const moveTask = (taskId, newStatus) => {
    if (!taskId || !newStatus) {
        console.error("moveTask: Invalid parameters");
        return;
    }

    socket.emit("task:move", {
        id: taskId,
        status: newStatus,
    });
};


/**
 * DELETE TASK
 */
export const deleteTask = (taskId) => {
    if (!taskId) {
        console.error("deleteTask: Task ID missing");
        return;
    }

    socket.emit("task:delete", taskId);
};