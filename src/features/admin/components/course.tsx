"use client";
import React, { useEffect, useState } from "react";
import { useGetCourse } from "../api/use-get-course";
import { Loader2, Plus } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import CourseActions from "./course-actions";

import SectionContainer from "./section-container";

interface Props {
  slug: string;
}

const Course = ({ slug }: Props) => {
  const { data, isLoading } = useGetCourse(slug);
  const [columns, setColumns] = useState(data?.sections || []);

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
              <Badge variant="outline">En desarrollo</Badge>
            )}
          </CardFooter>
        </Card>

        <SectionContainer sections={columns} slug={slug} />
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
