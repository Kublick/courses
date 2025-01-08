"use client";

import { useState } from "react";
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
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";

import { GripVertical } from "lucide-react";
import { Column } from "./draggy/types";
import { DraggableColumn } from "./draggy/draggable-column";
import { ItemContent } from "./draggy/item-content";

const DualColumnDragDrop = () => {
  const [columns, setColumns] = useState<Column[]>([
    {
      id: "column1",
      title: "Column 1",
      items: [
        { id: "1", content: "Item 1" },
        { id: "2", content: "Item 2" },
        { id: "3", content: "Item 3" },
      ],
    },
    {
      id: "column2",
      title: "Column 2",
      items: [
        { id: "4", content: "Item 4" },
        { id: "5", content: "Item 5" },
        { id: "6", content: "Item 6" },
      ],
    },
    {
      id: "column3",
      title: "Column 3",
      items: [
        { id: "7", content: "Item 7" },
        { id: "8", content: "Item 8" },
        { id: "9", content: "Item 9" },
      ],
    },
  ]);

  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  const findColumnAndItem = (id: string) => {
    for (const column of columns) {
      if (column.id === id) return { type: "column" as const, column };

      const item = column.items.find((item) => item.id === id);
      if (item) return { type: "item" as const, item, column };
    }
    return null;
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id.toString());
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeResult = findColumnAndItem(active.id.toString());
    const overResult = findColumnAndItem(over.id.toString());

    if (!activeResult || !overResult) return;

    // Handle dragging items between different columns
    if (
      activeResult.type === "item" &&
      (overResult.type === "item" || overResult.type === "column")
    ) {
      const activeColumn = activeResult.column;
      const overColumn =
        overResult.type === "column" ? overResult.column : overResult.column;

      if (activeColumn.id !== overColumn.id) {
        setColumns((prev) => {
          return prev.map((col) => {
            // Remove from active column
            if (col.id === activeColumn.id) {
              return {
                ...col,
                items: col.items.filter((item) => item.id !== active.id),
              };
            }
            // Add to target column
            if (col.id === overColumn.id) {
              const newItems = [...col.items];
              const overIndex =
                overResult.type === "item"
                  ? newItems.findIndex((item) => item.id === over.id)
                  : newItems.length;

              newItems.splice(overIndex, 0, activeResult.item);
              return {
                ...col,
                items: newItems,
              };
            }
            return col;
          });
        });
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      return;
    }

    const activeResult = findColumnAndItem(active.id.toString());
    const overResult = findColumnAndItem(over.id.toString());

    if (!activeResult || !overResult) {
      setActiveId(null);
      return;
    }

    // Handle column reordering
    if (activeResult.type === "column" && overResult.type === "column") {
      const activeColumnIndex = columns.findIndex(
        (col) => col.id === active.id
      );
      const overColumnIndex = columns.findIndex((col) => col.id === over.id);

      if (activeColumnIndex !== overColumnIndex) {
        setColumns((columns) =>
          arrayMove(columns, activeColumnIndex, overColumnIndex)
        );
      }
    }

    // Handle item sorting within the same column
    if (
      activeResult.type === "item" &&
      overResult.type === "item" &&
      activeResult.column.id === overResult.column.id
    ) {
      setColumns((prev) => {
        return prev.map((col) => {
          if (col.id !== activeResult.column.id) return col;

          const oldIndex = col.items.findIndex((item) => item.id === active.id);
          const newIndex = col.items.findIndex((item) => item.id === over.id);

          return {
            ...col,
            items: arrayMove(col.items, oldIndex, newIndex),
          };
        });
      });
    }

    setActiveId(null);
  };

  return (
    <div className="p-4">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-2 gap-4">
          <SortableContext
            items={columns.map((col) => col.id)}
            strategy={horizontalListSortingStrategy}
          >
            {columns.map((column) => (
              <DraggableColumn key={column.id} {...column} />
            ))}
          </SortableContext>
        </div>

        <DragOverlay>
          {activeId &&
            (() => {
              const result = findColumnAndItem(activeId);
              if (!result) return null;

              if (result.type === "item") {
                return (
                  <ItemContent
                    content={result.item.content}
                    isDragOverlay={true}
                  />
                );
              } else {
                return (
                  <div className="p-4 bg-white rounded-lg shadow">
                    <div className="flex items-center">
                      <GripVertical className="mr-2 text-gray-400" />
                      <h2 className="text-lg font-semibold">
                        {result.column.title}
                      </h2>
                    </div>
                  </div>
                );
              }
            })()}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default DualColumnDragDrop;
