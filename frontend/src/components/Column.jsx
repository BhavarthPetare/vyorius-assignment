import { useDrop } from "react-dnd";
import TaskCard from "./TaskCard";

const ItemTypes = {
    TASK: "task",
};

function Column({ title, status, tasks, onDelete, onMove, onUpdate }) {

    const [{ isOver }, drop] = useDrop(() => ({
        accept: ItemTypes.TASK,
        drop: (item) => {
            if (item.status !== status) {
                onMove(item.id, status);
            }
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
    }));

    return (
        <div
            ref={drop}
            style={{
                border: "1px solid #ccc",
                padding: "10px",
                width: "250px",
                minHeight: "300px",
                backgroundColor: isOver ? "#e6f7ff" : "#f9f9f9",
            }}
        >
            <h3>{title}</h3>

            {tasks.map((task) => (
                <TaskCard
                    key={task.id}
                    task={task}
                    onDelete={onDelete}
                    onUpdate={onUpdate}
                />
            ))}
        </div>
    );
}

export default Column;