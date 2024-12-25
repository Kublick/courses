"use client";
import React, { useEffect, useState } from "react";
import { useGetCourse } from "../api/use-get-course";
import {
  BookOpenText,
  ChevronDown,
  Loader2,
  Plus,
  Video,
  X,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useCreateCourseSection } from "../api/use-create-course-section";
import NewLecture from "./new-lecture";
import { useDeleteLecture } from "../api/use-delete-lecture";
import { Badge } from "@/components/ui/badge";
import CourseActions from "./course-actions";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import LectureAction from "./lecture-action";

interface Props {
  slug: string;
}

const Course = ({ slug }: Props) => {
  const { data, isLoading } = useGetCourse(slug);
  const [columns, setColumns] = useState(data?.sections || []);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (data?.sections) {
      const sortedSections = [...data.sections].sort(
        (a, b) => (a.position || 0) - (b.position || 0)
      );

      const sectionsWithSortedLectures = sortedSections.map((section) => ({
        ...section,
        lectures: [...section.lectures].sort(
          (a, b) => (a.position || 0) - (b.position || 0)
        ),
      }));

      setColumns(sectionsWithSortedLectures);
    }
  }, [data]);

  if (isLoading) {
    return (
      <div>
        <Loader2 className="animate-spin" /> Cargando Datos...
      </div>
    );
  }

  if (!data || !columns) {
    return <div>No existen curso</div>;
  }

  return (
    <div>
      <div className="p-4 grid ">
        <Card>
          <CardHeader>
            <div className="flex justify-end">
              <CourseActions />
            </div>
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-semibold">{data.title}</h1>
              <NewSection id={data.id} columns={columns.length} />
            </div>
          </CardHeader>
          <CardContent>
            <p> {data.description}</p>
          </CardContent>
          <CardFooter className="flex justify-end">
            {data.is_published ? (
              <Badge variant="success">Publicado</Badge>
            ) : (
              <Badge>En desarrollo</Badge>
            )}
          </CardFooter>
        </Card>
      </div>
      <div className="p-4 space-y-8">
        {columns.map((s) => (
          <div key={s.id}>
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-baseline ">
                    <h2 className="text-lg font-semibold mb-4">
                      Seccion: {s.title}
                    </h2>
                    <NewLecture
                      section_id={s.id}
                      lecturesLength={s.lectures.length}
                    />
                  </div>
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <p>{s.lectures.length} Lecciones</p>
                    <BookOpenText className="h-4 w-4 " />
                  </div>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-300 ${
                          isOpen ? "rotate-180" : "rotate-0"
                        }`}
                      />
                      <span className="sr-only">Toggle</span>
                    </Button>
                  </CollapsibleTrigger>
                </CardHeader>
                <CollapsibleContent className="space-y-2">
                  <CardContent className="space-y-4">
                    {s.lectures.map((l) => (
                      <Card key={l.id}>
                        <CardHeader>
                          <div className="flex justify-between items-center">
                            <p>Nombre: {l.title}</p>
                            <div className="flex gap-2 items-center">
                              <LectureAction lectureId={l.id} />
                              {/* <HandleDeleteLecture lectureId={l.id} /> */}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex gap-4 justify-between">
                            <p>Descripcion: {l.description}</p>
                            <p className="flex gap-2 items-center">
                              Tipo:
                              {l.content_type === "PDF" ? (
                                "PDF"
                              ) : (
                                <Video className="h-4 w-4" />
                              )}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          </div>
        ))}
      </div>
      <pre>{JSON.stringify(columns, null, 2)}</pre>
    </div>
  );
};

export default Course;

const NewSection = ({ id, columns }: { id: string; columns: number }) => {
  const createCourseSection = useCreateCourseSection();
  const [title, setTitle] = useState("");
  const [open, setOpen] = useState(false);

  function submit() {
    if (title.length === 0) {
      return;
    }

    createCourseSection.mutate({
      title,
      course_id: id,
      position: columns + 1,
    });

    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mt-6" variant="secondary" size="sm">
          <Plus className="h-6 w-6" /> Nueva Seccion
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear Nueva Sección</DialogTitle>
          <DialogDescription asChild>
            <div className="flex items-center space-x-2 pt-4">
              <div className="grid flex-1 gap-2">
                <Input
                  id="title"
                  defaultValue="Titulo"
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" onClick={submit}>
            Registrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
