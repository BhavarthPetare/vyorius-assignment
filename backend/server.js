const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

let tasks = [];


io.on("connection", (socket) => {
  console.log("A user connected");

  // TODO: Implement WebSocket events for task management
  socket.emit("sync:tasks", tasks);

  socket.on("task:create", (task) => {
    tasks.push(task);
    io.emit("task:created", task);
  });

  socket.on("task:update", (updated) => {
    tasks = tasks.map(t => t.id === updated.id ? updated:t);
    io.emit("task:updated", updated);
  });

  socket.on("task:move", ({id, status}) => {
    tasks = tasks.map(t => 
      t.id === id ? {...t, status} : t
    );
    io.emit("task:moved", {id, status});
  });

  socket.on("task:delete", (id) => {
    tasks = tasks.filter(t => t.id !== id);
    io.emit("task:deleted", id);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(5000, () => console.log("Server running on port 5000"));
