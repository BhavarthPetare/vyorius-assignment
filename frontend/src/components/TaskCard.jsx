import { useDrag } from "react-dnd";

const ItemTypes = {
    TASK: "task",
};

function TaskCard({ task, onDelete }) {

    const [{ isDragging }, drag] = useDrag(() => ({
        type: ItemTypes.TASK,
        item: { id: task.id, status: task.status },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    }));

    return (
        <div
            ref={drag}
            style={{
                border: "1px solid #999",
                padding: "8px",
                marginBottom: "8px",
                backgroundColor: "white",
                opacity: isDragging ? 0.5 : 1,
                cursor: "move",
            }}
        >
            <strong>{task.title}</strong>
            <br />
            <small>{task.priority}</small>
            <br />
            <button onClick={() => onDelete(task.id)}>
                Delete
            </button>
        </div>
    );
}

export default TaskCard;