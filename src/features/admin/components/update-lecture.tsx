"use client";
import React, { useState, useEffect } from "react";
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
import { toast } from "sonner";
import { ImageDropzone } from "@/components/ui/image-dropzone";
import { VideoDropzone } from "@/components/ui/video-dropzone";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useGetLecture } from "../api/use-get-lecture";
import { useUpdateLecture } from "../api/use-update-lecture";
import Video from "next-video";

const TipTapEditor = dynamic(() => import("./editor"), { ssr: false });

// Constants
const MAX_FILE_SIZE = 50 * 1024 * 1024;
const MAX_THUMBNAIL_SIZE = 2 * 1024 * 1024;
const ACCEPTED_VIDEO_TYPES = [
  "video/mp4",
  "video/mpeg",
  "video/quicktime",
  "video/x-msvideo",
  "video/webm",
];
const ACCEPTED_THUMBNAIL_TYPES = ["image/jpeg", "image/png", "image/gif"];

const updateLectureFormSchema = z.object({
  title: z.string().min(1, { message: "El título es obligatorio" }),
  description: z.string().optional(),
  file: z
    .instanceof(File)
    .refine((file) => !file || file.size <= MAX_FILE_SIZE, {
      message: "El archivo debe ser de 50MB o menos",
    })
    .refine((file) => !file || ACCEPTED_VIDEO_TYPES.includes(file.type), {
      message:
        "Por favor, sube un archivo de video válido (mp4, mpeg, mov, avi, webm)",
    })
    .nullish()
    .transform((file) => file ?? null),
  thumbnail: z
    .instanceof(File)
    .refine((file) => !file || file.size < MAX_THUMBNAIL_SIZE, {
      message: "El archivo debe ser de 2MB o menos",
    })
    .refine((file) => !file || ACCEPTED_THUMBNAIL_TYPES.includes(file.type), {
      message: "Por favor, sube una imagen válida (jpg, png, gif)",
    })
    .nullish()
    .transform((file) => file ?? null),
});

interface Props {
  lectureId: string;
  slug: string;
}

const UpdateLectureForm = ({ lectureId, slug }: Props) => {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [showVideoUpload, setShowVideoUpload] = useState(false);
  const [showThumbnailUpload, setShowThumbnailUpload] = useState(false);

  const { data: lecture, isLoading } = useGetLecture(lectureId);
  const updateLecture = useUpdateLecture();

  const form = useForm<z.infer<typeof updateLectureFormSchema>>({
    resolver: zodResolver(updateLectureFormSchema),
    defaultValues: {
      title: "",
      description: "",
      file: null,
      thumbnail: null,
    },
  });

  useEffect(() => {
    if (lecture) {
      form.reset({
        title: lecture.title,
        description: lecture.description ?? "",
        file: null,
        thumbnail: null,
      });
    }
  }, [lecture, form]);

  async function onSubmit(values: z.infer<typeof updateLectureFormSchema>) {
    setIsUploading(true);
    try {
      // Create a clean payload with proper undefined handling
      const payload: {
        id: string;
        title: string;
        description?: string;
        file?: File;
        thumbnail?: File;
      } = {
        id: lectureId,
        title: values.title,
        description: values.description || undefined,
      };

      if (showVideoUpload && values.file) {
        payload.file = values.file;
      }

      if (showThumbnailUpload && values.thumbnail) {
        payload.thumbnail = values.thumbnail;
      }

      await updateLecture.mutateAsync(payload);
      setIsUploading(false);
      toast.success("Lección actualizada exitosamente");
      router.push(`/admin/cursos/${slug}`);
    } catch (error) {
      console.error("Lecture update failed:", error);
      toast.error("Error al actualizar la lección");
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!lecture) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Lección no encontrada</p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Link
          href={`/admin/cursos/${slug}`}
          className="text-sm flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <p className="text-black hover:underline">Regresar</p>
        </Link>
        <h1 className="text-2xl font-bold pt-4">Actualizar Lección</h1>

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

          <div className=" flex gap-6 p-2 pb-6">
            {lecture.video && !showVideoUpload ? (
              <div className="space-y-2">
                <FormLabel className="text-lg font-semibold">
                  Video Actual
                </FormLabel>
                <div className=" space-y-2">
                  <div className="relative aspect-video max-w-2xl">
                    <Video
                      streamType="on-demand"
                      playbackId={lecture.video.playback_id ?? undefined}
                      className="rounded-lg"
                      controls
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      onClick={() => {
                        setShowVideoUpload(true);
                        form.setValue("file", null);
                      }}
                      size="sm"
                    >
                      Cambiar Video
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <FormField
                control={form.control}
                name="file"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nuevo Video</FormLabel>
                    <FormControl>
                      <VideoDropzone
                        field={{
                          ...field,
                          value: field.value,
                          onChange: (file: File | null) => {
                            field.onChange(file);
                            if (!file) setShowVideoUpload(false);
                          },
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {lecture.poster_url && !showThumbnailUpload ? (
              <div className="space-y-2">
                <FormLabel className="text-lg font-semibold">
                  Miniatura Actual
                </FormLabel>

                <div className="space-y-6">
                  <img
                    src={lecture.poster_url}
                    alt="Thumbnail"
                    className="rounded-lg max-h-[200px] object-cover"
                  />

                  <div className="flex justify-end">
                    <Button
                      type="button"
                      onClick={() => {
                        setShowThumbnailUpload(true);
                        form.setValue("thumbnail", null);
                      }}
                      size="sm"
                    >
                      Cambiar Miniatura
                    </Button>
                  </div>
                  <p className="text-xs text-pretty text-muted-foreground">
                    Se recomienda utilizar una imagen de 1920 x 1080 px
                  </p>
                </div>
              </div>
            ) : (
              <FormField
                control={form.control}
                name="thumbnail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nueva Miniatura</FormLabel>
                    <FormControl>
                      <ImageDropzone
                        field={{
                          ...field,
                          value: field.value,
                          onChange: (file: File | null) => {
                            field.onChange(file);
                            if (!file) setShowThumbnailUpload(false);
                          },
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contenido</FormLabel>
              <FormControl>
                <TipTapEditor
                  value={field.value ?? ""}
                  onChange={(value) => field.onChange(value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-6">
          <Button type="submit" disabled={isUploading}>
            {isUploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Actualizar"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default UpdateLectureForm;
