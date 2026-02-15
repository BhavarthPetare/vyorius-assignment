import TaskCard from "./TaskCard";
import {useDroppable} from '@dnd-kit/core';

function Column({ title, status, tasks, onUpdate, onDelete }) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });
  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col w-80 bg-gray-50 rounded-2xl border border-gray-200 p-5 shadow-sm transition ${isOver ? "border-blue-400 bg-blue-50" : "border-gray-200"}`}>

      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-800">
          {title}
        </h3>

        <span className="text-sm bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
          {tasks.length}
        </span>
      </div>

      <div className="flex flex-col gap-3">

        {tasks.length === 0 ? (
          <div className="text-center text-gray-400 text-sm py-6 border-2 border-dashed border-gray-200 rounded-xl">
            No tasks yet
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          ))
        )}

      </div>
    </div>
  );
}

export default Column;
