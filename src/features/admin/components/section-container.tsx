"use client";
import React, { useMemo, useState } from "react";
import {
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import dynamic from "next/dynamic";
import SectionCard from "./section-card";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";

const DndContextWithNoSSR = dynamic(
  () => import("@dnd-kit/core").then((mod) => mod.DndContext),
  {
    ssr: false,
  }
);

const initialValues = [
  {
    id: "ee5d1c95-199d-4eb9-9687-ac0175cde5c5",
    course_id: "89271c6d-e970-4d20-8ec5-1b46a21ffe82",
    is_published: false,
    title: "test",
    created_at: "2024-12-15T17:25:04.205834",
    updated_at: null,
    position: 0,
    lectures: [
      {
        id: "835ef05d-1539-4c2d-9d98-3b5fd883e660",
        section_id: "ee5d1c95-199d-4eb9-9687-ac0175cde5c5",
        title: "Prueba nuevo metodo",
        description: "Nuevo Metodo Test",
        content_type: "video/mp4",
        created_at: "2025-01-02T03:07:10.788885",
        updated_at: null,
        position: 0,
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
        position: 1,
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
        position: 2,
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
    ],
  },
  {
    id: "d245525a-e71a-4edb-8bb2-810da6bad99d",
    course_id: "89271c6d-e970-4d20-8ec5-1b46a21ffe82",
    is_published: false,
    title: "Seccion Duper",
    created_at: "2024-12-25T08:58:54.244168",
    updated_at: null,
    position: 1,
    lectures: [
      {
        id: "7b9a5dd9-c9d5-49bf-a695-86158c399360",
        section_id: "d245525a-e71a-4edb-8bb2-810da6bad99d",
        title: "moare tests",
        description: "",
        content_type: "video/mp4",
        created_at: "2025-01-02T01:12:50.533444",
        updated_at: null,
        position: 0,
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
    position: 2,
    lectures: [],
  },
];

const columnsData = initialValues.map((section) => ({
  id: section.id,
  title: section.title,
  lectures: section.lectures,
  position: section.position,
  is_published: section.is_published,
}));

export type LectureC = {
  id: string;
  title: string;
  position: number;
  columnId?: string;
};

export type Column = {
  id: string;
  title: string;
  lectures: LectureC[];
  position: number;
  is_published: boolean;
};

const lecturesWithColumnId: LectureC[] = initialValues.flatMap((section) =>
  section.lectures.map((lecture) => ({
    ...lecture,
    columnId: section.id,
  }))
);

console.log(lecturesWithColumnId);

const SectionContainer = () => {
  const [columns, setColumns] = useState<Column[]>(columnsData);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [lectures, setLectures] = useState<LectureC[]>(lecturesWithColumnId);
  const [activeLecture, setActiveLecture] = useState<LectureC | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 150,
      },
    })
  );

  const columnIds = useMemo(
    () => columns.map((column) => column.id),
    [columns]
  );

  const updateLecturePosition = async (lectureId: string, position: number) => {
    console.log("updateing lecture position", lectureId, position);
    // const response = await fetch(`/api/lectures/${lectureId}/position`, {
    //   method: 'PATCH',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ position }),
    // });
    // if (!response.ok) {
    //   throw new Error('Failed to update lecture position');
    // }
  };

  function handleDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === "Column") {
      console.log("over a column", event.active.data.current?.column);
      setActiveColumn(event.active.data.current?.column);
      return;
    }
    if (event.active.data.current?.type === "Lecture") {
      console.log("over a lecture", event.active.data.current?.lecture);
      setActiveLecture(event.active.data.current?.lectures);
      return;
    }
  }

  function onDragOverHandler(event: DragOverEvent) {
    const { active, over } = event;

    if (!over) return;

    const activeColumnId = active.id;
    const overColumnId = over.id;
    if (activeColumnId === overColumnId) {
      return;
    }

    //Im dropping a lecture over a lecture

    const isActiveLecture = active.data.current?.type === "Lecture";
    const isOverALecture = over.data.current?.type === "Lecture";

    if (!isActiveLecture) return;

    if (isActiveLecture && isOverALecture) {
      setLectures((tasks) => {
        const activeIndex = tasks.findIndex((task) => task.id === active.id);
        const overIndex = tasks.findIndex((task) => task.id === over.id);

        tasks[activeIndex].columnId = tasks[overIndex].columnId;

        const reorderedTasks = arrayMove(tasks, activeIndex, overIndex);

        reorderedTasks.forEach((task, index) => {
          updateLecturePosition(task.id, index).catch((error) => {
            console.error("Failed to update lecture position:", error);
          });
        });

        return reorderedTasks;
      });
    }

    // Dropping a lecture over a column
    const isOverAColumn = over.data.current?.type === "Column";
    if (isOverAColumn) {
      setLectures((lecture) => {
        const activeIndex = lecture.findIndex((task) => task.id === active.id);
        const overIndex = lecture.findIndex((task) => task.id === over.id);

        lecture[activeIndex].columnId = String(over.id);

        return arrayMove(lecture, activeIndex, overIndex);
      });
    }
  }

  function onDragEndHandler(event: DragEndEvent) {
    setActiveColumn(null);
    setActiveLecture(null);
    const { active, over } = event;
    if (!over) return;

    const activeColumnId = active.id;
    const overColumnId = over.id;

    setColumns((columns) => {
      const activeIndex = columns.findIndex((col) => col.id === activeColumnId);
      const overIndex = columns.findIndex((col) => col.id === overColumnId);

      const updatedColumns = arrayMove(columns, activeIndex, overIndex);

      const updatedWithPositions = updatedColumns.map((col, index) => ({
        ...col,
        position: index,
      }));

      // Prepare the data for the database update
      const updates = updatedWithPositions.map(({ id, position }) => ({
        id,
        position,
      }));

      // Update the database (pseudo-code)
      //   updateDatabasePositions(updates).catch((error) => {
      //     console.error("Failed to update positions:", error);
      //   });

      return updatedColumns;
    });
  }

  return (
    <DndContextWithNoSSR
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={onDragEndHandler}
      onDragOver={onDragOverHandler}
      modifiers={[restrictToVerticalAxis]}
    >
      <div className="flex flex-col space-y-4 p-4 ">
        <SortableContext items={columnIds}>
          {columns.map((column) => (
            <div key={column.id}>
              <SectionCard
                column={column}
                lectures={lectures.filter(
                  (lect) => lect.columnId === column.id
                )}
              />
            </div>
          ))}
        </SortableContext>
      </div>
      <DragOverlay>
        {activeColumn && <SectionCard column={activeColumn} lectures={[]} />}
        {/* {activeTask && <TaskCard task={activeTask} />} */}
      </DragOverlay>
    </DndContextWithNoSSR>
  );
};

export default SectionContainer;
