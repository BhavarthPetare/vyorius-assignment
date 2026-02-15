import React from "react";
import './App.css';
import KanbanBoard from "./components/KanbanBoard";

function App() {
  return (
    <div className="bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-800 p-4">Real-time Kanban Board</h1>
      <KanbanBoard />
    </div>
  );
}

export default App;
