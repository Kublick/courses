"use client";
import React, { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateLecture } from "../api/use-create-lecture";
import { toast } from "sonner";
import { ImageDropzone } from "@/components/ui/image-dropzone";
import { VideoDropzone } from "@/components/ui/video-dropzone";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const TipTapEditor = dynamic(() => import("./editor"), { ssr: false });

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const MAX_THUMBNAIL_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_VIDEO_TYPES = [
  "video/mp4",
  "video/mpeg",
  "video/quicktime",
  "video/x-msvideo",
  "video/webm",
];

const ACCEPTED_THUMBNAIL_TYPES = ["image/jpeg", "image/png", "image/gif"];

export const lectureFormSchema = z.object({
  title: z.string().min(1, { message: "El título es obligatorio" }),
  description: z.string().optional(),
  file: z
    .instanceof(File)
    .refine((file) => file !== undefined, {
      message: "Por favor, selecciona un archivo de video",
    })
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: "El archivo debe ser de 50MB o menos",
    })
    .refine((file) => ACCEPTED_VIDEO_TYPES.includes(file.type), {
      message:
        "Por favor, sube un archivo de video válido (mp4, mpeg, mov, avi, webm)",
    })
    .optional(),
  thumbnail: z
    .instanceof(File)
    .refine((file) => file !== undefined, {
      message: "Por favor, selecciona un archivo de video",
    })
    .refine((file) => file.size < MAX_THUMBNAIL_SIZE, {
      message: "El archivo debe ser de 50MB o menos",
    })
    .refine((file) => ACCEPTED_THUMBNAIL_TYPES.includes(file.type), {
      message:
        "Por favor, sube un archivo de video válido (mp4, mpeg, mov, avi, webm)",
    })
    .optional(),
});

interface Props {
  section_id: string;
  lecturesLength: number;
  slug: string;
}

const LectureForm = ({ section_id, lecturesLength, slug }: Props) => {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [newForm, setNewForm] = useState(false);

  const form = useForm<z.infer<typeof lectureFormSchema>>({
    resolver: zodResolver(lectureFormSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const createLecture = useCreateLecture();

  async function onSubmit(values: z.infer<typeof lectureFormSchema>) {
    setIsUploading(true);

    try {
      const position = lecturesLength + 1;

      createLecture.mutate({
        title: values.title,
        description: values.description ?? "",
        section_id: section_id,
        position: position,
        file: values.file,
        thumbnail: values.thumbnail,
      });

      // Reset form and close dialog
      form.reset();
    } catch (error) {
      console.error("Lecture creation failed:", error);
      toast.error("Error al crear la lección");
      // Handle error (maybe show a toast or error message)
    } finally {
      setIsUploading(false);
      toast.success("Lección creada exitosamente");
      if (newForm) {
        setNewForm(false);
        router.push(
          `/admin/cursos/${slug}/${section_id}/lectura?numero=${lecturesLength + 1}`,
        );
      } else {
        router.push(`/admin/cursos/${slug}`);
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Link
          href={`/admin/cursos/${slug}`}
          className="text-sm flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4 " />
          <p className="text-black hover:underline">Regresar</p>
        </Link>
        <h1 className="text-2xl font-bold pt-4">Crear Nueva Lección</h1>

        <div className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título</FormLabel>
                <FormControl>
                  <Input placeholder="Nombre de la lección" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <TipTapEditor
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="file"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Multimedia</FormLabel>
                <FormControl>
                  <VideoDropzone
                    field={{
                      ...field,
                      value: field.value || null,
                      onChange: (file: File | null) => field.onChange(file),
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="thumbnail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Miniatura</FormLabel>
                <FormControl>
                  <ImageDropzone field={field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-4 items-center pt-6">
          <div className="flex items-center space-x-2 ">
            <label
              htmlFor="newform"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Agregar una lección en esta sección
            </label>
            <Checkbox
              id="newform"
              checked={newForm}
              onCheckedChange={() => setNewForm(!newForm)}
            />
          </div>
          <Button type="submit" disabled={isUploading}>
            {isUploading ? "Subiendo..." : "Registrar"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default LectureForm;
