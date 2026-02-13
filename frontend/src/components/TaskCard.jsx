import { useState } from "react";
import { useDrag } from "react-dnd";

const ItemTypes = {
    TASK: "task",
};

function TaskCard({ task, onDelete, onUpdate }) {

    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState(task);

    const [{ isDragging }, drag] = useDrag(() => ({
        type: ItemTypes.TASK,
        item: { id: task.id, status: task.status },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    }));

    const handleSave = () => {
        onUpdate(editData);
        setIsEditing(false);
    };

    return (
        <div
            ref={drag}
            style={{
                border: "1px solid #999",
                padding: "10px",
                marginBottom: "10px",
                backgroundColor: "white",
                opacity: isDragging ? 0.5 : 1,
                cursor: "move",
            }}
        >
            {isEditing ? (
                <>
                    <input
                        value={editData.title}
                        onChange={(e) =>
                            setEditData({ ...editData, title: e.target.value })
                        }
                    />
                    <select
                        value={editData.priority}
                        onChange={(e) =>
                            setEditData({ ...editData, priority: e.target.value })
                        }
                    >
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                    </select>

                    <button onClick={handleSave}>Save</button>
                </>
            ) : (
                <>
                    <strong>{task.title}</strong>
                    <br />
                    <small>{task.priority}</small>
                    <br />
                    <button onClick={() => setIsEditing(true)}>Edit</button>
                    <button onClick={() => onDelete(task.id)}>Delete</button>
                </>
            )}
        </div>
    );
}

export default TaskCard;