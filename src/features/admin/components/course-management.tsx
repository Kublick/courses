"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";

import { insertCourseSchema } from "@/server/db/schema";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useCreateCourse } from "../api/use-create-course";
import { useGetCourses } from "../api/use-get-courses";

export function CourseManagement() {
  const form = useForm<z.infer<typeof insertCourseSchema>>({
    resolver: zodResolver(insertCourseSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
    },
  });

  const createCourseMutation = useCreateCourse();
  const { data: courses, isLoading } = useGetCourses();

  if (isLoading) return <div>Loading...</div>;

  function onSubmit(data: z.infer<typeof insertCourseSchema>) {
    createCourseMutation.mutate(data);
  }

  return (
    <div className="max-w-xl min-w-sm">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Agregar Curso</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Titulo</FormLabel>
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
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Descripcion del curso"
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Precio</FormLabel>
                        <div className="flex items-center gap-2">
                          <FormControl>
                            <Input placeholder="Precio" {...field} />
                          </FormControl>
                          <p>USD</p>
                        </div>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">
                    <Plus className="w-4 h-4 mr-2" /> Agregar Curso
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </form>
      </Form>
      <div className="mt-6 flex gap-6">
        {courses?.map((course) => (
          <Card key={course.id} className="max-w-64">
            <CardHeader>{course.title}</CardHeader>
            <CardContent>
              <p>{course.description}</p>
              <p>{course.price}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
