"use client";
import React, { useEffect, useMemo, useState } from "react";
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
import EmptyLecture from "./empty-lecture";
import { Lecture, SectionWithLecturesType } from "@/server/db/schema";

const DndContextWithNoSSR = dynamic(
  () => import("@dnd-kit/core").then((mod) => mod.DndContext),
  {
    ssr: false,
  }
);

export type Column = Pick<
  SectionWithLecturesType,
  "id" | "title" | "is_published" | "position" | "lectures"
>;

export type LectureC = Pick<
  Lecture,
  "id" | "title" | "position" | "is_published" | "description"
> & {
  columnId: string;
};

interface Props {
  sections: SectionWithLecturesType[];
}

const SectionContainer = (props: Props) => {
  const [columns, setColumns] = useState<Column[]>([]);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [lectures, setLectures] = useState<LectureC[]>([]);
  const [activeLecture, setActiveLecture] = useState<LectureC | null>(null);

  useEffect(() => {
    const columnsData = props.sections.map((section) => ({
      id: section.id,
      title: section.title,
      lectures: section.lectures,
      position: section.position,
      is_published: section.is_published,
    }));
    setColumns(columnsData);

    const lecturesWithColumnId: LectureC[] = props.sections.flatMap((section) =>
      section.lectures.map((lecture) => ({
        ...lecture,
        columnId: section.id,
      }))
    );

    setLectures(lecturesWithColumnId);
  }, [props.sections]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 50,
      },
    })
  );

  const columnIds = useMemo(
    () => columns.map((column) => column.id),
    [columns]
  );

  const updateLecturePosition = async (lectureId: string, position: number) => {
    console.log("updating lecture position", lectureId, position);
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
      setActiveColumn(event.active.data.current?.column);
      return;
    }
    if (event.active.data.current?.type === "Lecture") {
      setActiveLecture(event.active.data.current?.lectures);
      return;
    }
  }

  function onDragOverHandler(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id.toString();
    const overId = over.id.toString();

    if (activeId === overId) return;

    const isActiveLecture = active.data.current?.type === "Lecture";
    const isOverLecture = over.data.current?.type === "Lecture";
    const isOverColumn = over.data.current?.type === "Column";

    if (!isActiveLecture) return;

    setLectures((lectures) => {
      const activeIndex = lectures.findIndex((l) => l.id === activeId);
      if (activeIndex === -1) return lectures;

      // Handle lecture over lecture
      if (isOverLecture) {
        const overIndex = lectures.findIndex((l) => l.id === overId);
        if (overIndex === -1) return lectures;

        const newColumnId = lectures[overIndex].columnId;
        const updatedLectures = [...lectures];
        updatedLectures[activeIndex] = {
          ...updatedLectures[activeIndex],
          columnId: newColumnId,
        };

        const reordered = arrayMove(updatedLectures, activeIndex, overIndex);

        // Update positions for all lectures in the affected column
        const columnLectures = reordered.filter(
          (l) => l.columnId === newColumnId
        );
        columnLectures.forEach((lecture, index) => {
          const lectureIndex = reordered.findIndex((l) => l.id === lecture.id);
          reordered[lectureIndex] = { ...lecture, position: index };
          updateLecturePosition(lecture.id, index).catch((error) => {
            console.error("Failed to update lecture position:", error);
          });
        });

        return reordered;
      }

      // Handle lecture over column
      if (isOverColumn) {
        const newColumnId = overId;
        const updatedLectures = [...lectures];
        updatedLectures[activeIndex] = {
          ...updatedLectures[activeIndex],
          columnId: newColumnId,
        };

        // Update positions for all lectures in the target column
        const columnLectures = updatedLectures.filter(
          (l) => l.columnId === newColumnId
        );
        columnLectures.forEach((lecture, index) => {
          const lectureIndex = updatedLectures.findIndex(
            (l) => l.id === lecture.id
          );
          updatedLectures[lectureIndex] = { ...lecture, position: index };
          updateLecturePosition(lecture.id, index).catch((error) => {
            console.error("Failed to update lecture position:", error);
          });
        });

        return updatedLectures;
      }

      return lectures;
    });
  }

  function onDragEndHandler(event: DragEndEvent) {
    setActiveColumn(null);
    setActiveLecture(null);
    const { active, over } = event;
    if (!over) return;

    const activeColumnId = active.id;
    const overColumnId = over.id;

    if (active.data.current?.type === "Column") {
      setColumns((columns) => {
        const activeIndex = columns.findIndex(
          (col) => col.id === activeColumnId
        );
        const overIndex = columns.findIndex((col) => col.id === overColumnId);

        const updatedColumns = arrayMove(columns, activeIndex, overIndex);
        return updatedColumns.map((col, index) => ({
          ...col,
          position: index,
        }));
      });
    }
  }
  const getLecturesForSection = (sectionId: string) => {
    return lectures.filter((lecture) => lecture.columnId === sectionId);
  };
  return (
    <DndContextWithNoSSR
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={onDragEndHandler}
      onDragOver={onDragOverHandler}
      modifiers={[restrictToVerticalAxis]}
    >
      <div className="flex flex-col space-y-4 p-4">
        <SortableContext items={columnIds}>
          {columns.map((column) => {
            const sectionLectures = getLecturesForSection(column.id);
            return (
              <div key={column.id}>
                <SectionCard
                  column={column}
                  lectures={sectionLectures}
                  totalLectures={sectionLectures.length}
                />
              </div>
            );
          })}
        </SortableContext>
      </div>
      <DragOverlay>
        {activeColumn && (
          <SectionCard column={activeColumn} lectures={[]} totalLectures={0} />
        )}
        {activeLecture && <EmptyLecture />}
      </DragOverlay>
    </DndContextWithNoSSR>
  );
};

export default SectionContainer;
