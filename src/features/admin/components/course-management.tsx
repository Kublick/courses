"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Pencil,
  Plus,
  Trash,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  MoveDown,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface Lecture {
  id: string;
  title: string;
  duration: string;
}

interface Chapter {
  id: string;
  title: string;
  lectures: Lecture[];
}

interface Course {
  id: string;
  title: string;
  description: string;
  chapters: Chapter[];
}

export function CourseManagement() {
  const [courses, setCourses] = useState<Course[]>([
    {
      id: "1",
      title: "Introduction to React",
      description: "Learn the basics of React",
      chapters: [
        {
          id: "c1",
          title: "Getting Started",
          lectures: [
            { id: "l1", title: "What is React?", duration: "10:00" },
            {
              id: "l2",
              title: "Setting up your environment",
              duration: "15:00",
            },
          ],
        },
        {
          id: "c2",
          title: "React Fundamentals",
          lectures: [
            { id: "l3", title: "Components and Props", duration: "20:00" },
            { id: "l4", title: "State and Lifecycle", duration: "25:00" },
          ],
        },
      ],
    },
    {
      id: "2",
      title: "Advanced JavaScript",
      description: "Deep dive into JavaScript concepts",
      chapters: [
        {
          id: "c3",
          title: "ES6+ Features",
          lectures: [
            { id: "l5", title: "Arrow Functions", duration: "15:00" },
            { id: "l6", title: "Destructuring", duration: "12:00" },
          ],
        },
      ],
    },
  ]);
  const [newCourse, setNewCourse] = useState({ title: "", description: "" });
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [expandedCourses, setExpandedCourses] = useState<string[]>([]);

  const addCourse = () => {
    if (newCourse.title && newCourse.description) {
      setCourses([
        ...courses,
        { ...newCourse, id: Date.now().toString(), chapters: [] },
      ]);
      setNewCourse({ title: "", description: "" });
    }
  };

  const updateCourse = () => {
    if (editingCourse) {
      setCourses(
        courses.map((course) =>
          course.id === editingCourse.id ? editingCourse : course
        )
      );
      setEditingCourse(null);
    }
  };

  const deleteCourse = (id: string) => {
    setCourses(courses.filter((course) => course.id !== id));
  };

  const toggleCourseExpansion = (courseId: string) => {
    setExpandedCourses((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId]
    );
  };

  const moveLecture = (
    courseId: string,
    chapterId: string,
    lectureId: string,
    direction: "up" | "down"
  ) => {
    setCourses((prevCourses) => {
      return prevCourses.map((course) => {
        if (course.id !== courseId) return course;

        return {
          ...course,
          chapters: course.chapters.map((chapter) => {
            if (chapter.id !== chapterId) return chapter;

            const lectureIndex = chapter.lectures.findIndex(
              (lecture) => lecture.id === lectureId
            );
            if (lectureIndex === -1) return chapter;

            const newLectures = [...chapter.lectures];
            const [removedLecture] = newLectures.splice(lectureIndex, 1);

            if (direction === "up" && lectureIndex > 0) {
              newLectures.splice(lectureIndex - 1, 0, removedLecture);
            } else if (
              direction === "down" &&
              lectureIndex < newLectures.length
            ) {
              newLectures.splice(lectureIndex + 1, 0, removedLecture);
            } else {
              newLectures.splice(lectureIndex, 0, removedLecture);
            }

            return { ...chapter, lectures: newLectures };
          }),
        };
      });
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Course</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="new-title">Title</Label>
              <Input
                id="new-title"
                value={newCourse.title}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, title: e.target.value })
                }
                placeholder="Course Title"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-description">Description</Label>
              <Input
                id="new-description"
                value={newCourse.description}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, description: e.target.value })
                }
                placeholder="Course Description"
              />
            </div>
            <Button onClick={addCourse}>
              <Plus className="w-4 h-4 mr-2" /> Add Course
            </Button>
          </div>
        </CardContent>
      </Card>

      {courses.map((course) => (
        <Collapsible
          key={course.id}
          open={expandedCourses.includes(course.id)}
          onOpenChange={() => toggleCourseExpansion(course.id)}
        >
          <Card>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer">
                <div className="flex items-center justify-between">
                  <CardTitle>{course.title}</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    aria-expanded={expandedCourses.includes(course.id)}
                  >
                    {expandedCourses.includes(course.id) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {course.description}
                </p>
                <div className="flex space-x-2 mb-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingCourse(course)}
                  >
                    <Pencil className="w-4 h-4 mr-2" /> Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteCourse(course.id)}
                  >
                    <Trash className="w-4 h-4 mr-2" /> Delete
                  </Button>
                </div>
                <h4 className="font-semibold mb-2">Chapters</h4>
                {course.chapters.map((chapter) => (
                  <div key={chapter.id} className="mb-4">
                    <h5 className="font-medium">{chapter.title}</h5>
                    <ul className="list-none pl-4">
                      {chapter.lectures.map((lecture, index) => (
                        <li
                          key={lecture.id}
                          className="flex items-center justify-between text-sm py-1"
                        >
                          <span>
                            {lecture.title} ({lecture.duration})
                          </span>
                          <div className="flex space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                moveLecture(
                                  course.id,
                                  chapter.id,
                                  lecture.id,
                                  "up"
                                )
                              }
                              disabled={index === 0}
                            >
                              <ChevronUp className="h-4 w-4" />
                              <span className="sr-only">Move Up</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                moveLecture(
                                  course.id,
                                  chapter.id,
                                  lecture.id,
                                  "down"
                                )
                              }
                              disabled={index === chapter.lectures.length - 1}
                            >
                              <MoveDown className="h-4 w-4" />
                              <span className="sr-only">Move Down</span>
                            </Button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      ))}

      {editingCourse && (
        <Card>
          <CardHeader>
            <CardTitle>Edit Course</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={editingCourse.title}
                  onChange={(e) =>
                    setEditingCourse({
                      ...editingCourse,
                      title: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Input
                  id="edit-description"
                  value={editingCourse.description}
                  onChange={(e) =>
                    setEditingCourse({
                      ...editingCourse,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <Button onClick={updateCourse}>Update Course</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
