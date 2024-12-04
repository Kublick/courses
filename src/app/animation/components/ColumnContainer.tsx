import React, { useMemo } from "react";
import { Column, Task } from "./UserList";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import TaskCard from "./TaskCard";

interface Props {
  column: Column;
  tasks: Task[];
}

const ColumnContainer = (props: Props) => {
  const { column, tasks } = props;
  const tasksIds = useMemo(() => tasks.map((task) => task.id), [tasks]);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
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
        className="bg-teal-50 h-[320px] w-48  border-2 opacity-80"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="flex flex-col gap-4 h-[320px] w-48 bg-teal-200 p-2"
    >
      {column.title}
      <SortableContext items={tasksIds}>
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </SortableContext>
    </div>
  );
};

export default ColumnContainer;
