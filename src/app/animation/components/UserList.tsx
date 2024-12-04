"use client";
import React, { useMemo, useState } from "react";
import ColumnContainer from "./ColumnContainer";
import {
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import dynamic from "next/dynamic";
import { DragOverlay } from "@dnd-kit/core";
import TaskCard from "./TaskCard";
const DndContextWithNoSSR = dynamic(
  () => import("@dnd-kit/core").then((mod) => mod.DndContext),
  {
    ssr: false,
  }
);

const initialColumns = [
  {
    id: 1,
    title: "Lectures",
  },
  {
    id: 2,
    title: "Sections",
  },
  {
    id: 3,
    title: "Lectures 2",
  },
];

export type Id = string | number;

export type Column = {
  id: Id;
  title: string;
};

export type Task = {
  id: Id;
  columnId: Id;
  content: string;
};

const initialTasks: Task[] = [
  {
    id: "1",
    columnId: 1,
    content: "Task 1",
  },
  {
    id: "2",
    columnId: 1,
    content: "Task 2",
  },
  {
    id: "3",
    columnId: 1,
    content: "Task 3",
  },
  {
    id: "4",
    columnId: 1,
    content: "Task 4",
  },
];

const UserList = () => {
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 100,
      },
    })
  );

  const columnIds = useMemo(
    () => columns.map((column) => column.id),
    [columns]
  );

  function handleDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current?.column);
      return;
    }

    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current?.task);
      return;
    }
  }

  function onDragEndHandler(event: DragEndEvent) {
    setActiveColumn(null);
    setActiveTask(null);
    const { active, over } = event;

    if (!over) return;

    const activeColumnId = active.id;
    const overColumnId = over.id;

    if (activeColumnId === overColumnId) {
      return;
    }

    setColumns((columns) => {
      const activeIndex = columns.findIndex((col) => col.id === activeColumnId);
      const overIndex = columns.findIndex((col) => col.id === overColumnId);

      return arrayMove(columns, activeIndex, overIndex);
    });
  }

  function onDragOverHandler(event: DragOverEvent) {
    const { active, over } = event;

    if (!over) return;

    const activeColumnId = active.id;
    const overColumnId = over.id;
    if (activeColumnId === overColumnId) {
      return;
    }

    //Im dropping a task over a task

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if (!isActiveATask) return;

    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((task) => task.id === active.id);
        const overIndex = tasks.findIndex((task) => task.id === over.id);

        tasks[activeIndex].columnId = tasks[overIndex].columnId;

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    // Dropping a task over a column
    const isOverAColumn = over.data.current?.type === "Column";
    if (isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((task) => task.id === active.id);
        const overIndex = tasks.findIndex((task) => task.id === over.id);

        tasks[activeIndex].columnId = over.id;

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }
  }

  return (
    <DndContextWithNoSSR
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={onDragEndHandler}
      onDragOver={onDragOverHandler}
    >
      <div className="m-auto flex min-h-screen w-full items-center justify-center p-4">
        <div className="flex gap-4 ">
          <SortableContext items={columnIds}>
            {columns.map((column) => (
              <div key={column.id}>
                <ColumnContainer
                  column={column}
                  tasks={tasks.filter((task) => task.columnId === column.id)}
                />
              </div>
            ))}
          </SortableContext>
        </div>
      </div>
      <DragOverlay>
        {activeColumn && <ColumnContainer column={activeColumn} tasks={[]} />}
        {activeTask && <TaskCard task={activeTask} />}
      </DragOverlay>
      , document.body
    </DndContextWithNoSSR>
  );
};

export default UserList;
