import React from "react";
import { LectureC } from "./section-container";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  lecture: LectureC;
}

const LectureCard = (props: Props) => {
  const { lecture } = props;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: lecture.id,
    data: {
      type: "Lecture",
      lecture,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="py-4"
    >
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex items-center space-x-8">
              <GripVertical size={20} className="cursor-grab" />
              {lecture.title}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Content</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default LectureCard;
