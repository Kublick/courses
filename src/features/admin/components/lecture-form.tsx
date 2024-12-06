import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB
const ACCEPTED_VIDEO_TYPES = [
  "video/mp4",
  "video/webm",
  "video/ogg",
  "application/pdf",
];

const lectureUploadSchema = z.object({
  title: z.string(),
  description: z.string(),
  video: z
    .custom<File>((file) => file instanceof File, {
      message: "Un video es requerido.",
    })
    .refine((file) => ACCEPTED_VIDEO_TYPES.includes(file.type), {
      message: "El formato del video no es compatible MP4, WebM o OGG o PDF.",
    })
    .refine((file) => file.size <= MAX_VIDEO_SIZE, {
      message: "El archivo no puede exceder los 50MB.",
    }),
});

const LectureForm = () => {
  const form = useForm<z.infer<typeof lectureUploadSchema>>({
    resolver: zodResolver(lectureUploadSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  return (
    <Form {...form}>
      <form>
        <Card>
          <CardHeader>
            <CardTitle>Agregar Lecciones</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} />
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
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Submit</Button>
            {/* <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="new-title">Title</Label>
              <Input
                id="new-title"
                value={newLecture.title}
                onChange={(e) =>
                  setNewLecture({ ...newLecture, title: e.target.value })
                }
                placeholder="Lecture Title"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-course">Course</Label>
              <Select
                value={newLecture.courseId}
                onValueChange={(value) =>
                  setNewLecture({
                    ...newLecture,
                    courseId: value,
                    chapterId: "",
                  })
                }
              >
                <SelectTrigger id="new-course">
                  <SelectValue placeholder="Select Course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-chapter">Chapter</Label>
              <Select
                value={newLecture.chapterId}
                onValueChange={(value) =>
                  setNewLecture({ ...newLecture, chapterId: value })
                }
              >
                <SelectTrigger id="new-chapter">
                  <SelectValue placeholder="Select Chapter" />
                </SelectTrigger>
                <SelectContent>
                  {chapters
                    .filter(
                      (chapter) => chapter.courseId === newLecture.courseId
                    )
                    .map((chapter) => (
                      <SelectItem key={chapter.id} value={chapter.id}>
                        {chapter.title}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-duration">Duration</Label>
              <Input
                id="new-duration"
                value={newLecture.duration}
                onChange={(e) =>
                  setNewLecture({ ...newLecture, duration: e.target.value })
                }
                placeholder="HH:MM:SS"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-file">File</Label>
              <Input
                id="new-file"
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setNewLecture({ ...newLecture, file: file.name });
                  }
                }}
              />
            </div>
            <Button onClick={addLecture}>
              <Upload className="w-4 h-4 mr-2" /> Upload Lecture
            </Button>
          </div> */}
          </CardContent>
        </Card>
      </form>
    </Form>
  );
};

export default LectureForm;
