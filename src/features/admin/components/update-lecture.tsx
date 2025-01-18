"use client";

import { useGetLecture } from "../api/use-get-lecture";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  FormControl,
  FormMessage,
  FormField,
  FormItem,
  FormLabel,
  Form,
} from "@/components/ui/form";
import VideoPlayer from "@/components/ui/mux-video";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import TipTapEditor from "./editor";
import { VideoDropzone } from "@/components/ui/video-dropzone";
import { ImageDropzone } from "@/components/ui/image-dropzone";
import { useEffect } from "react";
interface Props {
  id: string;
}

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

const UpdateLectureSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
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
  poster_url: z.string().nullish(),
});

const UpdateLecture = ({ id }: Props) => {
  const { data, isLoading } = useGetLecture(id);

  const form = useForm<z.infer<typeof UpdateLectureSchema>>({
    resolver: zodResolver(UpdateLectureSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  useEffect(() => {
    if (data) {
      form.reset({
        title: data.title,
        description: data.description ?? "",
      });
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen gap-6">
        <Loader2 className="animate-spin" /> Cargando Datos...
      </div>
    );
  }

  if (!data) {
    return <div>No existe este contenido</div>;
  }

  return (
    <Form {...form}>
      <div className="p-4">
        <Card>
          <CardHeader>
            <CardTitle>Editar Contenido</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Titulo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <TipTapEditor
                      value={field.value || ""}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <div className="p-6">
            <h2 className="font-bold">Multimedia</h2>
            <Card>
              <CardHeader>
                <CardTitle>
                  <div className="pl-6">
                    <p className="text-foreground text-sm ">
                      Duración:{" "}
                      {data?.video?.duration
                        ? Math.floor(data.video.duration)
                        : 0}{" "}
                      segundos
                    </p>
                  </div>
                </CardTitle>
                <CardContent>
                  <Separator />

                  {data?.video && (
                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-2">
                        <div className="mt-4">
                          {data?.video.playback_id ? (
                            <VideoPlayer
                              playbackId={data.video.playback_id}
                              posterUrl={data.poster_url ?? ""}
                            />
                          ) : (
                            <FormField
                              control={form.control}
                              name="file"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Archivo</FormLabel>
                                  <FormControl>
                                    <VideoDropzone
                                      field={{
                                        ...field,
                                        value: field.value || null,
                                        onChange: (file: File | null) =>
                                          field.onChange(file),
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
                      <div className="mt-4 text-xs">
                        <p>Miniatura</p>
                        {data?.poster_url ? (
                          <Image
                            src={data.poster_url ?? ""}
                            height={320}
                            width={568}
                            className="w-auto"
                            alt={data.title}
                            priority={true}
                          />
                        ) : (
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
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </CardHeader>
            </Card>
          </div>
        </Card>
      </div>
    </Form>
  );
};

export default UpdateLecture;
