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
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertLectureSchema } from "@/server/db/schema";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import { useCreateLecture } from "../api/use-create-lecture";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 10MB
const ACCEPTED_VIDEO_TYPES = [
  "video/mp4",
  "video/mpeg",
  "video/quicktime",
  "video/x-msvideo",
  "video/webm",
];

export const lectureFormSchema = z.object({
  title: z.string().min(1, { message: "El título es obligatorio" }),
  description: z.string().optional(),

  file: z
    .instanceof(File)
    .refine((file) => file !== undefined, {
      message: "Por favor, selecciona un archivo de video",
    })
    .refine(
      (file) => {
        // Ensure the file is within the size limit
        return file?.size <= MAX_FILE_SIZE;
      },
      {
        message: "El archivo debe ser de 50MB o menos",
      }
    )
    .refine(
      (file) => {
        // Ensure the file type is valid for videos
        return file ? ACCEPTED_VIDEO_TYPES.includes(file.type) : true; // Skip validation if the file is not present
      },
      {
        message:
          "Por favor, sube un archivo de video válido (mp4, mpeg, mov, avi, webm)",
      }
    ),
});

interface Props {
  section_id: string;
  lecturesLength: number;
}

const NewLecture = ({ section_id, lecturesLength }: Props) => {
  const [open, setOpen] = React.useState(false);

  const form = useForm<z.infer<typeof lectureFormSchema>>({
    resolver: zodResolver(lectureFormSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const createLecture = useCreateLecture();

  console.log(lecturesLength);

  function onSubmit(values: z.infer<typeof insertLectureSchema>) {
    const position = lecturesLength + 1;
    console.log("🚀 ~ onSubmit ~ position:", position);

    createLecture.mutate({
      ...values,
      section_id: section_id,
      position: position,
      content_type: "video",
      content_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    });
    form.reset();
    setOpen(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="mt-6">
              <Plus className="h-6 w-6" /> Nueva Lección
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
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descripción</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Descripción" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="file"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Archivo</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept="video/*"
                            onChange={(event) => {
                              const file = event.target.files?.[0] || null;
                              field.onChange(file);
                              form.trigger("file");
                            }}
                          />
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
                onClick={async () => {
                  await form.trigger();
                  if (form.formState.isValid) {
                    onSubmit(form.getValues());
                  }
                }}
              >
                Registrar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </form>
    </Form>
  );
};

export default NewLecture;
