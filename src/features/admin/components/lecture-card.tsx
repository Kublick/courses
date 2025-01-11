import React from "react";
import { LectureC } from "./section-container";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LectureAction from "./lecture-action";

interface Props {
  lecture: LectureC;
  enableDrag: boolean;
  setEnableDrag: (enable: boolean) => void;
}

const LectureCard = (props: Props) => {
  const { enableDrag, setEnableDrag } = props;
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

  if (isDragging) {
    return (
      <Card
        ref={setNodeRef}
        style={style}
        className="bg-slate-100 h-[120px] border-2 opacity-80"
      >
        <CardHeader></CardHeader>
      </Card>
    );
  }

  return (
    <div ref={setNodeRef} {...attributes} style={style} className="py-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between space-x-8">
            <div className="flex items-center space-x-2">
              {enableDrag && (
                <GripVertical
                  size={20}
                  className="cursor-grab text-gray-500"
                  {...listeners}
                />
              )}
              <p> {lecture.title}</p>
            </div>
            <div className="flex-end">
              <LectureAction
                lectureId={lecture.id}
                is_published={lecture.is_published ?? false}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent></CardContent>
      </Card>
    </div>
  );
};

export default LectureCard;
