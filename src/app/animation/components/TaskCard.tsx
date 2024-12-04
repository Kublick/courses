import React from "react";
import { Task } from "./UserList";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Props {
  task: Task;
}

const TaskCard = (props: Props) => {
  const { task } = props;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-red-50 w-full py-4 border-2 border-red-400 rounded"
      />
    );
  }
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="bg-purple-50 px-3 py-2 rounded-lg"
    >
      {task.content}
    </div>
  );
};

export default TaskCard;
