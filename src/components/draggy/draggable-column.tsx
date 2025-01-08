"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import type { Column } from "./types";
import { DraggableItem } from "./draggable-item";

interface DraggableColumnProps extends Column {}

export const DraggableColumn = ({ id, title, items }: DraggableColumnProps) => {
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
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-4 bg-gray-100 rounded-lg ${isDragging ? "opacity-50" : ""}`}
    >
      <div
        className="flex items-center mb-4 cursor-grab"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="mr-2 text-gray-400" />
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      <SortableContext
        items={items.map((item) => item.id)}
        strategy={verticalListSortingStrategy}
      >
        {items.map((item) => (
          <DraggableItem key={item.id} {...item} />
        ))}
      </SortableContext>
    </div>
  );
};
