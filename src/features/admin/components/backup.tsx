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

// Update findContainer to handle compound IDs
const findContainer = (id: string): string => {
  // The first UUID in the compound ID is the section ID
  return id.split("-").slice(0, 5).join("-");
};

// Update main component handlers
const SectionContainer = ({ sections }: Props) => {
  const [columns, setColumns] = useState<SectionWithLecturesType[]>(sections);

  useEffect(() => {
    setColumns(sections);
  }, [sections]);

  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeLecture, setActiveLecture] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  // Update handleDragStart
  const handleDragStart = (event: DragStartEvent) => {
    const activeId = event.active.id.toString();
    setActiveId(activeId);

    // Check if this is a lecture by looking for compound ID
    if (activeId.includes("-")) {
      const sectionId = activeId.split("-").slice(0, 5).join("-");
      const lectureId = activeId.split("-").slice(5).join("-");

      const section = columns.find((s) => s.id === sectionId);
      const lecture = section?.lectures.find((l) => l.id === lectureId);

      console.log("Debug:", { sectionId, lectureId, section, lecture });

      if (lecture) {
        setActiveLecture({
          id: lecture.id,
          title: lecture.title,
        });
      }
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    console.log("drag over", { event });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const isSection = columns.some((col) => col.id === active.id);

    if (isSection) {
      setColumns((prev) => {
        const oldIndex = prev.findIndex((item) => item.id === active.id);
        const newIndex = prev.findIndex((item) => item.id === over.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    } else {
      const activeId = active.id.toString();
      const overId = over.id.toString();
      const activeContainer = findContainer(activeId);
      const overContainer = findContainer(overId);

      if (!activeContainer || !overContainer) return;

      if (activeContainer === overContainer) {
        setColumns((prev) => {
          const sectionIndex = prev.findIndex(
            (section) => section.id === activeContainer
          );

          if (sectionIndex === -1) return prev;

          const section = prev[sectionIndex];
          if (!section) return prev;

          const lectures = [...section.lectures];

          // Extract lecture IDs from compound IDs
          const activeLectureId = activeId.split("-").slice(5).join("-");
          const overLectureId = overId.split("-").slice(5).join("-");

          const oldIndex = lectures.findIndex(
            (lecture) => lecture.id === activeLectureId
          );
          const newIndex = lectures.findIndex(
            (lecture) => lecture.id === overLectureId
          );

          if (oldIndex === -1 || newIndex === -1) return prev;

          const reorderedLectures = arrayMove(lectures, oldIndex, newIndex);

          return prev.map((section, index) =>
            index === sectionIndex
              ? { ...section, lectures: reorderedLectures }
              : section
          );
        });
      }
    }

    setActiveId(null);
    setActiveLecture(null);
  };
  console.log(activeLecture);

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

      {/* Update DragOverlay */}
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
