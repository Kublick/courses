"use client";

import { useGetLecture } from "../api/use-get-lecture";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { selectLectureSchemaWithVideo } from "@/server/db/schema";
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
interface Props {
  id: string;
}

const UpdateLecture = ({ id }: Props) => {
  const { data, isLoading } = useGetLecture(id);

  const form = useForm<z.infer<typeof selectLectureSchemaWithVideo>>({
    resolver: zodResolver(selectLectureSchemaWithVideo),
    defaultValues: {
      title: "",
      description: "",
      content_type: "",
      position: null,
      section_id: null,
    },
    values: data,
  });

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
                    <Input
                      placeholder="Descripción"
                      {...field}
                      value={field.value ?? ""}
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

                  {data?.video?.playback_id && (
                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-2">
                        <div className="mt-4">
                          <VideoPlayer
                            playbackId={data.video.playback_id}
                            posterUrl={data.poster_url ?? ""}
                          />
                        </div>
                      </div>
                      <div className="mt-4 text-xs">
                        <p>Miniatura del video</p>
                        <Image
                          src={`https://image.mux.com/${data.video.playback_id}/thumbnail.png?time=2&height=121&width=214`}
                          alt={`Thumbnail de la sección ${data?.title}`}
                          width={320}
                          height={320}
                        />
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
