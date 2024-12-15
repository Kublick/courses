"use client";
import React, { useEffect, useState } from "react";
import { useGetCourse } from "../api/use-get-course";
import { Loader2, Plus, Video, X } from "lucide-react";
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
// import UpdateLecture from "./update-lecture";

interface Props {
  slug: string;
}

const UpdateCourse = ({ slug }: Props) => {
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
            <h1 className="text-xl font-semibold">Curso:{data.title}</h1>
          </CardHeader>
          <CardContent>
            <p> Descripcion {data.description}</p>
          </CardContent>
          <CardFooter className="flex justify-end">
            <NewSection id={data.id} columns={columns.length} />
          </CardFooter>
        </Card>
      </div>
      <div className="p-4 space-y-8">
        {columns.map((s) => (
          <div key={s.id}>
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
              </CardHeader>

              <CardContent className="space-y-4">
                {s.lectures.map((l) => (
                  <Card key={l.id}>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <p>Nombre: {l.title}</p>
                        <div className="flex gap-2 items-center">
                          {/* <UpdateLecture
                            id={l.id}
                            title={l.title}
                            description={l.description ?? ""}
                            section_id={s.id}
                            position={l.position ?? 0}
                          /> */}
                          <HandleDeleteLecture lectureId={l.id} />
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

                      <p>Archivo:</p>
                      {l.content_url && (
                        <video width="120" height="120">
                          <source src={l.content_url} type="video/mp4" />
                        </video>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
      <pre>{JSON.stringify(columns, null, 2)}</pre>
    </div>
  );
};

export default UpdateCourse;

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
        <Button className="mt-6" variant="secondary">
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

const HandleDeleteLecture = ({ lectureId }: { lectureId: string }) => {
  const deleteLecture = useDeleteLecture();
  const [open, setOpen] = useState(false);
  const handleDeleteLecture = async () => {
    deleteLecture.mutate({
      id: lectureId,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" onClick={() => setOpen(true)}>
          <X className=" text-rose-600" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar Lectura</DialogTitle>
          <DialogDescription asChild>
            <p>¿Estas seguro que deseas eliminar esta Lectura?</p>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="destructive"
            type="button"
            onClick={handleDeleteLecture}
          >
            Eliminar
          </Button>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
