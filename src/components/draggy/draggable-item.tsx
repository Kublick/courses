"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import type { Item } from "./types";
import { ItemContent } from "./item-content";

interface DraggableItemProps extends Item {
  id: string;
  content: string;
}

export const DraggableItem = ({ id, content }: DraggableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="mb-2 bg-white rounded-lg shadow"
    >
      <div {...attributes} {...listeners}>
        <ItemContent content={content} />
      </div>
    </div>
  );
};
