import React, { useMemo, useState } from "react";
import { Column, LectureC } from "./section-container";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { BookOpenText, ChevronDown, GripVertical } from "lucide-react";
import LectureCard from "./lecture-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NewLecture from "./new-lecture";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";

interface Props {
  column: Column;
  lectures: LectureC[];
  totalLectures: number;
  enableDrag: boolean;
  setEnableDrag: (enable: boolean) => void;
}

const SectionCard = (props: Props) => {
  const { enableDrag, setEnableDrag } = props;
  const { column, lectures, totalLectures } = props;
  const [isOpen, setIsOpen] = useState(false);

  const lectureIds = useMemo(
    () => lectures.map((lecture) => lecture.id),
    [lectures]
  );

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
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
        className="bg-rose-100 h-[300px] border-2 opacity-80"
      >
        <CardHeader></CardHeader>
      </Card>
    );
  }

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      style={style}
      className="flex flex-col space-y-4"
    >
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex justify-end">
                {enableDrag && (
                  <GripVertical
                    size={20}
                    className="cursor-grab"
                    {...listeners}
                  />
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-baseline">
              <h2 className="text-lg font-semibold mb-4">
                Seccion: {column.title}
              </h2>

              <NewLecture
                section_id={column.id}
                lecturesLength={totalLectures}
              />
            </div>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <p>{lectures.length} Lecciones</p>
              <BookOpenText className="h-4 w-4" />
            </div>

            <div className="flex justify-end">
              {column.is_published ? (
                <Badge variant="success">Publicado</Badge>
              ) : (
                <Badge variant="outline">En desarrollo</Badge>
              )}
            </div>
            <div className="py-4">
              <Separator />
            </div>

            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="w-full">
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-300 ${
                    isOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
                <span className="sr-only">Toggle</span>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2">
              <SortableContext items={lectureIds}>
                {lectures.map((lecture) => (
                  <LectureCard
                    key={lecture.id}
                    lecture={lecture}
                    enableDrag={enableDrag}
                    setEnableDrag={setEnableDrag}
                  />
                ))}
              </SortableContext>
            </CollapsibleContent>
          </CardContent>
        </Card>
      </Collapsible>
    </div>
  );
};

export default SectionCard;
