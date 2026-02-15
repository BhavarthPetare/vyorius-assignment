import { useState } from "react";
import {useDraggable} from '@dnd-kit/core';
import {CSS} from '@dnd-kit/utilities';

function TaskCard({ task, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(task);

  const handleSave = () => {
    if (!formData.title.trim()) return;
    onUpdate(formData);
    setIsEditing(false);
  };

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: "transform 200ms ease",
  };

  const handleCancel = () => {
    setFormData(task);
    setIsEditing(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4 transition-all duration-200 ${isDragging? "opacity-0" : ""}`}>

      {isEditing ? (
        <div className="space-y-3">

          <input
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />

          <select
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={formData.priority}
            onChange={(e) =>
              setFormData({ ...formData, priority: e.target.value })
            }
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex flex-row items-center justify-between">
            <h4 className="text-lg font-semibold text-gray-800">
              {task.title}
            </h4>

            <button
              {...listeners}
              {...attributes}
              className="cursor-grab text-2xl text-gray-400 hover:text-gray-600"
            >
              ⠿
            </button>
          </div>

          <span
            className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
              task.priority === "High"
                ? "bg-red-100 text-red-600"
                : task.priority === "Medium"
                ? "bg-yellow-100 text-yellow-600"
                : "bg-green-100 text-green-600"
            }`}
          >
            {task.priority}
          </span>

          <div className="flex gap-2 pt-2">
            <button
              onClick={() => setIsEditing(true)}
              className="px-3 py-1 text-sm bg-indigo-100 text-indigo-600 rounded-md hover:bg-indigo-200 transition"
            >
              Edit
            </button>

            <button
              onClick={() => onDelete(task.id)}
              className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskCard;
