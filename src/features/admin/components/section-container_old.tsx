import React, { useEffect, useState } from "react";
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SectionWithLecturesType } from "@/server/db/schema";
import { GripVertical } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  sections: SectionWithLecturesType[];
}

interface Lecture {
  id: string;
  title: string;
}

// Add new DraggableLecture component
const DraggableLecture = ({ id, title }: { id: string; title: string }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div className="flex items-center">
        <GripVertical size={20} className="cursor-grab" {...listeners} />
        <p>{title}</p>
      </div>
    </div>
  );
};

// Update DraggableItem component
const DraggableItem: React.FC<{
  id: string;
  title: string;
  lectures: Lecture[];
}> = ({ id, title, lectures }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "unset",
  };

  const lectureIds = lectures.map((lecture) => `${id}-${lecture.id}`);

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex justify-end">
              <GripVertical size={20} className="cursor-grab" {...listeners} />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>{title}</p>
          <SortableContext
            items={lectureIds}
            strategy={verticalListSortingStrategy}
          >
            {lectures.map((lecture) => (
              <DraggableLecture
                key={`${id}-${lecture.id}`}
                id={`${id}-${lecture.id}`}
                title={lecture.title}
              />
            ))}
          </SortableContext>
        </CardContent>
      </Card>
    </div>
  );
};
const findContainer = (id: string): string => {
  return id.split("-").slice(0, 5).join("-");
};

const SectionContainer = ({ sections }: Props) => {
  const [columns, setColumns] = useState<SectionWithLecturesType[]>(sections);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeLecture, setActiveLecture] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  useEffect(() => {
    setColumns(sections);
  }, [sections]);

  const handleDragStart = (event: DragStartEvent) => {
    const activeId = event.active.id.toString();
    setActiveId(activeId);

    if (activeId.includes("-")) {
      const sectionId = findContainer(activeId);
      const lectureId = activeId.split("-").slice(5).join("-");
      const section = columns.find((s) => s.id === sectionId);
      const lecture = section?.lectures.find((l) => l.id === lectureId);

      if (lecture) {
        setActiveLecture({
          id: lecture.id,
          title: lecture.title,
        });
      }
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id.toString();
    const overId = over.id.toString();

    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId);

    if (activeContainer === overContainer) return;

    // Only handle lecture movements between sections
    if (activeId.includes("-")) {
      setColumns((prev) => {
        const activeSection = prev.find((s) => s.id === activeContainer);
        const overSection = prev.find((s) => s.id === overContainer);

        if (!activeSection || !overSection) return prev;

        const activeLectureId = activeId.split("-").slice(5).join("-");
        const lecture = activeSection.lectures.find(
          (l) => l.id === activeLectureId
        );
        if (!lecture) return prev;

        const updatedSourceLectures = activeSection.lectures.filter(
          (l) => l.id !== activeLectureId
        );

        const updatedTargetLectures = [...overSection.lectures];

        if (overId.includes("-")) {
          const overLectureId = overId.split("-").slice(5).join("-");
          const overIndex = updatedTargetLectures.findIndex(
            (l) => l.id === overLectureId
          );
          updatedTargetLectures.splice(overIndex, 0, lecture);
        } else {
          updatedTargetLectures.push(lecture);
        }

        return prev.map((section) => {
          if (section.id === activeContainer) {
            return { ...section, lectures: updatedSourceLectures };
          }
          if (section.id === overContainer) {
            return { ...section, lectures: updatedTargetLectures };
          }
          return section;
        });
      });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id.toString();
    const overId = over.id.toString();

    // Handle section reordering
    const isSection = !activeId.includes("-");
    if (isSection) {
      const oldIndex = columns.findIndex((col) => col.id === activeId);
      const newIndex = columns.findIndex((col) => col.id === overId);

      if (oldIndex !== newIndex) {
        const newColumns = arrayMove(columns, oldIndex, newIndex);
        setColumns(newColumns);
      }
    }
    // Handle lecture reordering within the same section
    else {
      const activeContainer = findContainer(activeId);
      const overContainer = findContainer(overId);

      if (activeContainer === overContainer) {
        const sectionIndex = columns.findIndex(
          (section) => section.id === activeContainer
        );

        if (sectionIndex === -1) return;

        const section = columns[sectionIndex];
        const activeLectureId = activeId.split("-").slice(5).join("-");
        const overLectureId = overId.split("-").slice(5).join("-");

        const oldIndex = section.lectures.findIndex(
          (l) => l.id === activeLectureId
        );
        const newIndex = section.lectures.findIndex(
          (l) => l.id === overLectureId
        );

        if (oldIndex !== newIndex) {
          const newLectures = arrayMove(section.lectures, oldIndex, newIndex);
          const newColumns = [...columns];
          newColumns[sectionIndex] = { ...section, lectures: newLectures };
          setColumns(newColumns);
        }
      }
    }

    setActiveId(null);
    setActiveLecture(null);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={columns.map((col) => col.id)}
        strategy={verticalListSortingStrategy}
      >
        <div>
          {columns.map((c) => (
            <div key={c.id} className="py-4">
              <DraggableItem id={c.id} title={c.title} lectures={c.lectures} />
            </div>
          ))}
        </div>
      </SortableContext>

      <DragOverlay>
        {activeId && (
          <div className="bg-gray-100 rounded-lg p-4">
            <div className="flex items-center">
              <GripVertical className="mr-2 text-gray-400" />
              <span className="text-sm">
                {activeLecture
                  ? activeLecture.title
                  : columns.find((c) => c.id === activeId)?.title}
              </span>
            </div>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
};

export default SectionContainer;
