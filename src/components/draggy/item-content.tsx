"use client";

import { GripVertical } from "lucide-react";

interface ItemContentProps {
  content: string;
  isDragOverlay?: boolean;
}

export const ItemContent = ({ content, isDragOverlay }: ItemContentProps) => (
  <div
    className={`flex items-center p-4 ${isDragOverlay ? "bg-white rounded-lg shadow" : ""}`}
  >
    <GripVertical className="mr-2 text-gray-400 cursor-grab" />
    <span className="select-none">{content}</span>
  </div>
);
