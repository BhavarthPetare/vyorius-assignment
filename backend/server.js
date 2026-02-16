const express = require("express");
const http = require("http");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: {
  origin: "*",
  methods: ["GET", "POST"],
} });
const PORT = process.env.PORT || 5000;

const DATA_FILE = path.join(__dirname, "tasks.json");
let tasks = [];

if (fs.existsSync(DATA_FILE)) {
  try {
    const data = fs.readFileSync(DATA_FILE, "utf-8");
    tasks = JSON.parse(data);
  } catch (err) {
    console.error("Error reading tasks.json:", err);
    tasks = [];
  }
}

function saveTasks() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2));
  } catch (error) {
    console.error("Error saving tasks:", err);
  }
}


io.on("connection", (socket) => {
  console.log("A user connected");

  // Respond to explicit task request instead of auto-emitting
  socket.on("request:tasks", () => {
    socket.emit("sync:tasks", tasks);
  });

  socket.on("task:create", (task) => {
    tasks.push(task);
    saveTasks();
    io.emit("task:created", task);
  });

  socket.on("task:update", (updated) => {
    tasks = tasks.map(t => t.id === updated.id ? updated:t);
    saveTasks();
    io.emit("task:updated", updated);
  });

  socket.on("task:move", ({id, status}) => {
    tasks = tasks.map(t => 
      t.id === id ? {...t, status} : t
    );
    saveTasks();
    io.emit("task:moved", {id, status});
  });

  socket.on("task:delete", (id) => {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    io.emit("task:deleted", id);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
