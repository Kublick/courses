"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import { useCreateLecture } from "../api/use-create-lecture";
import { toast } from "sonner";
import { ImageDropzone } from "@/components/ui/image-dropzone";
import { VideoDropzone } from "@/components/ui/video-dropzone";

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
    }),
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
}

const NewLecture = ({ section_id, lecturesLength }: Props) => {
  const [open, setOpen] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);

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
    console.log(values);
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
      setOpen(false);
    } catch (error) {
      console.error("Lecture creation failed:", error);
      toast.error("Error al crear la lección");
      // Handle error (maybe show a toast or error message)
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="mt-6" size="sm">
              Añadir <ChevronDown className="h-6 w-6" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Nueva Lección</DialogTitle>
              <DialogDescription asChild>
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título</FormLabel>
                        <FormControl>
                          <Input placeholder="Título" {...field} />
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
                        <FormLabel>Archivo</FormLabel>
                        <FormControl>
                          <VideoDropzone field={field} />
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
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                type="submit"
                disabled={isUploading}
                onClick={async () => {
                  await form.trigger();
                  if (form.formState.isValid) {
                    onSubmit(form.getValues());
                  }
                }}
              >
                {isUploading ? "Subiendo..." : "Registrar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </form>
    </Form>
  );
};

export default NewLecture;
