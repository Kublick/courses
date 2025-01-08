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
    title: "test",
  },
  {
    id: 2,
    title: "Seccion Duper",
  },
  {
    id: 3,
    title: "New Duper Section with nothing",
  },
];

const values = [
  {
    id: "ee5d1c95-199d-4eb9-9687-ac0175cde5c5",
    course_id: "89271c6d-e970-4d20-8ec5-1b46a21ffe82",
    is_published: false,
    title: "test",
    created_at: "2024-12-15T17:25:04.205834",
    updated_at: null,
    position: 1,
    lectures: [
      {
        id: "835ef05d-1539-4c2d-9d98-3b5fd883e660",
        section_id: "ee5d1c95-199d-4eb9-9687-ac0175cde5c5",
        title: "Prueba nuevo metodo",
        description: "Nuevo Metodo Test",
        content_type: "video/mp4",
        created_at: "2025-01-02T03:07:10.788885",
        updated_at: null,
        position: 5,
        video: {
          id: "e9611a27-2879-4a70-8493-a492d8494727",
          status: "ready",
          asset_id: "eFkwBDxivi7pQtYxNFjZSXQ7rtry501n7tFFayXMD2Us",
          playback_id: "JYKpkAEnmTvQ4TvOswJ2FPOFQsNwy01PWotROsmKMEoI",
          passthrough: "xO6ZcRP9oCUTA7i8sNOCI",
          duration: 10.066667,
          upload_id: "qOZ1y8RJ86LsLqCPICft2TM02sw00kL85eKcA3rbX9rZQ",
          created_at: "2025-01-02T03:07:10.614176",
          updated_at: null,
        },
        is_published: false,
        poster_url:
          "https://incrementatuconsulta.s3.us-west-1.amazonaws.com/A_pW35IbTZpWHCk59I6r4.webp",
        slug: null,
      },
      {
        id: "cecbe22d-c7d1-489e-8e57-ddbcd580f5bc",
        section_id: "ee5d1c95-199d-4eb9-9687-ac0175cde5c5",
        title: "supermanga",
        description: "mangasuper",
        content_type: "video/mp4",
        created_at: "2025-01-02T00:39:27.857212",
        updated_at: null,
        position: 6,
        video: {
          id: "23e8c8d7-6a89-4e6f-9e87-97d901aa619e",
          status: "ready",
          asset_id: "SLHYMD5HhIVXxf77Uf9WPne7i8Gf83yyPFPBGbgtV7Q",
          playback_id: "MRJWN2DZetlpHl023sZiNGqcDatjM02CdS01Za1I100r02100",
          passthrough: "6xSZYenjRdFAwPA-XQdjK",
          duration: 10,
          upload_id: "inipSCsXvHtl402YuQDUkdtGGA9Ko02Zhrwnb018wh02q8k",
          created_at: "2025-01-02T00:39:27.683258",
          updated_at: null,
        },
        is_published: false,
        poster_url:
          "https://incrementatuconsulta.s3.us-west-1.amazonaws.com/1_U-44E_oSNDPfixmC4W4.webp",
        slug: null,
      },
      {
        id: "6ac3b4ac-5410-4f7d-99f6-e896db230355",
        section_id: "ee5d1c95-199d-4eb9-9687-ac0175cde5c5",
        title: "El buenas buenas",
        description: "Bien buenas",
        content_type: "video/mp4",
        created_at: "2025-01-02T00:57:16.04759",
        updated_at: null,
        position: 7,
        video: {
          id: "1cedcacf-89c5-41f4-a921-c92b32da18cf",
          status: "waiting",
          asset_id: null,
          playback_id: null,
          passthrough: "SoZmRCHm-k7ZQFB8je4jR",
          duration: null,
          upload_id: "i7OwhB00vUSV6R00j602guRL5zK8MUhkIb8nPNDwDV6ADk",
          created_at: "2025-01-02T00:57:15.901105",
          updated_at: null,
        },
        is_published: false,
        poster_url:
          "https://incrementatuconsulta.s3.us-west-1.amazonaws.com/W5cdF-rbn7JWjq_EcP915.webp",
        slug: null,
      },
      {
        id: "11b28457-05fd-4913-b307-78148c681f0e",
        section_id: "ee5d1c95-199d-4eb9-9687-ac0175cde5c5",
        title: "buenas buenas",
        description: "Test Buenas",
        content_type: "video/mp4",
        created_at: "2025-01-02T01:02:22.655767",
        updated_at: null,
        position: 8,
        video: {
          id: "ce25ed7d-0718-439e-9324-0ea533c32f2a",
          status: "ready",
          asset_id: null,
          playback_id: null,
          passthrough: "kt2hy_ruWXeKGSc2xov2y",
          duration: 10.066667,
          upload_id: "NWSYIzFMM8Zyqz6qXu021ebIaJF01CFKR1CzxzbgqFCtU",
          created_at: "2025-01-02T01:02:22.596786",
          updated_at: null,
        },
        is_published: false,
        poster_url:
          "https://incrementatuconsulta.s3.us-west-1.amazonaws.com/iLRURO_nKO0cdc2BiL6Pf.webp",
        slug: null,
      },
      {
        id: "48bdde55-899c-4088-ae65-bcdae5f47226",
        section_id: "ee5d1c95-199d-4eb9-9687-ac0175cde5c5",
        title: "Test with new fucntion",
        description: "New function. test",
        content_type: "video/mp4",
        created_at: "2025-01-02T02:41:42.528963",
        updated_at: null,
        position: 9,
        video: {
          id: "fe473903-fe98-4e90-9f52-e6a909749d1c",
          status: "ready",
          asset_id: "oIWNxeXam1csDyouy8cjxrRCM01xlDrVACKYs6hogZ01E",
          playback_id: "01JQUdkjUxpbfvT2FP4R004rcGk01wiml016400n44WhGf028",
          passthrough: "Ar8CrsLH8ajrxIf29U7EV",
          duration: 10.066667,
          upload_id: "hD2aRqkfxrG9lZ02PMwDgWY800D02l3IWzzsv8uDsmILz4",
          created_at: "2025-01-02T02:41:42.354003",
          updated_at: null,
        },
        is_published: false,
        poster_url:
          "https://incrementatuconsulta.s3.us-west-1.amazonaws.com/xjvDFwCalcHHvILuvHdx9.webp",
        slug: null,
      },
    ],
  },
  {
    id: "d245525a-e71a-4edb-8bb2-810da6bad99d",
    course_id: "89271c6d-e970-4d20-8ec5-1b46a21ffe82",
    is_published: false,
    title: "Seccion Duper",
    created_at: "2024-12-25T08:58:54.244168",
    updated_at: null,
    position: 2,
    lectures: [
      {
        id: "7b9a5dd9-c9d5-49bf-a695-86158c399360",
        section_id: "d245525a-e71a-4edb-8bb2-810da6bad99d",
        title: "moare tests",
        description: "",
        content_type: "video/mp4",
        created_at: "2025-01-02T01:12:50.533444",
        updated_at: null,
        position: 3,
        video: {
          id: "79ec7923-3fda-4f5d-b195-d5e1e2fcb995",
          status: "ready",
          asset_id: "hI5iWb00nZ8QJrCNcsMqP94BCYXpoWTjW1Hto00OhrnJM",
          playback_id: "niCGVG00VByxX7WeylzY4Lbq5iDb1XlmZmMNlBclA9y00",
          passthrough: "n2olrH9i6PwwFwTDAwMzD",
          duration: 10.1101,
          upload_id: "xBtL1KDE6jA8016yuXNyjPokoxnu009Id6qbgMNbjuoWg",
          created_at: "2025-01-02T01:12:50.339136",
          updated_at: null,
        },
        is_published: false,
        poster_url:
          "https://incrementatuconsulta.s3.us-west-1.amazonaws.com/W-FdSfNnNfVUGwXBI-3F5.webp",
        slug: null,
      },
    ],
  },
  {
    id: "f50e5428-c819-46de-8faa-b10d52ad4b1e",
    course_id: "89271c6d-e970-4d20-8ec5-1b46a21ffe82",
    is_published: false,
    title: "New Duper Section with nothing",
    created_at: "2025-01-07T00:19:08.383261",
    updated_at: null,
    position: 3,
    lectures: [],
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
