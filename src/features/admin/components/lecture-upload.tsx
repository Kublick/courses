"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, Trash, Upload } from "lucide-react";

interface Lecture {
  id: string;
  title: string;
  chapterId: string;
  courseId: string;
  duration: string;
  file: string;
}

interface Chapter {
  id: string;
  title: string;
  courseId: string;
}

interface Course {
  id: string;
  title: string;
}

export function LectureUpload() {
  const [lectures, setLectures] = useState<Lecture[]>([
    {
      id: "1",
      title: "Introduction to HTML",
      chapterId: "c1",
      courseId: "1",
      duration: "10:00",
      file: "intro-html.mp4",
    },
    {
      id: "2",
      title: "CSS Styling",
      chapterId: "c1",
      courseId: "1",
      duration: "15:00",
      file: "css-styling.mp4",
    },
  ]);
  const [newLecture, setNewLecture] = useState({
    title: "",
    chapterId: "",
    courseId: "",
    duration: "",
    file: "",
  });
  const [editingLecture, setEditingLecture] = useState<Lecture | null>(null);

  // Mock data for courses and chapters
  const courses: Course[] = [
    { id: "1", title: "Web Development Basics" },
    { id: "2", title: "Advanced JavaScript" },
  ];
  const chapters: Chapter[] = [
    { id: "c1", title: "HTML Fundamentals", courseId: "1" },
    { id: "c2", title: "CSS Basics", courseId: "1" },
    { id: "c3", title: "JavaScript Essentials", courseId: "2" },
  ];

  const addLecture = () => {
    if (
      newLecture.title &&
      newLecture.chapterId &&
      newLecture.courseId &&
      newLecture.duration &&
      newLecture.file
    ) {
      setLectures([...lectures, { ...newLecture, id: Date.now().toString() }]);
      setNewLecture({
        title: "",
        chapterId: "",
        courseId: "",
        duration: "",
        file: "",
      });
    }
  };

  const updateLecture = () => {
    if (editingLecture) {
      setLectures(
        lectures.map((lecture) =>
          lecture.id === editingLecture.id ? editingLecture : lecture
        )
      );
      setEditingLecture(null);
    }
  };

  const deleteLecture = (id: string) => {
    setLectures(lectures.filter((lecture) => lecture.id !== id));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload New Lecture</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
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
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lectures</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Chapter</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>File</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lectures.map((lecture) => (
                <TableRow key={lecture.id}>
                  <TableCell>{lecture.title}</TableCell>
                  <TableCell>
                    {courses.find((c) => c.id === lecture.courseId)?.title}
                  </TableCell>
                  <TableCell>
                    {chapters.find((c) => c.id === lecture.chapterId)?.title}
                  </TableCell>
                  <TableCell>{lecture.duration}</TableCell>
                  <TableCell>{lecture.file}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingLecture(lecture)}
                    >
                      <Pencil className="w-4 h-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteLecture(lecture.id)}
                    >
                      <Trash className="w-4 h-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {editingLecture && (
        <Card>
          <CardHeader>
            <CardTitle>Edit Lecture</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={editingLecture.title}
                  onChange={(e) =>
                    setEditingLecture({
                      ...editingLecture,
                      title: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-course">Course</Label>
                <Select
                  value={editingLecture.courseId}
                  onValueChange={(value) =>
                    setEditingLecture({
                      ...editingLecture,
                      courseId: value,
                      chapterId: "",
                    })
                  }
                >
                  <SelectTrigger id="edit-course">
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
                <Label htmlFor="edit-chapter">Chapter</Label>
                <Select
                  value={editingLecture.chapterId}
                  onValueChange={(value) =>
                    setEditingLecture({ ...editingLecture, chapterId: value })
                  }
                >
                  <SelectTrigger id="edit-chapter">
                    <SelectValue placeholder="Select Chapter" />
                  </SelectTrigger>
                  <SelectContent>
                    {chapters
                      .filter(
                        (chapter) =>
                          chapter.courseId === editingLecture.courseId
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
                <Label htmlFor="edit-duration">Duration</Label>
                <Input
                  id="edit-duration"
                  value={editingLecture.duration}
                  onChange={(e) =>
                    setEditingLecture({
                      ...editingLecture,
                      duration: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-file">File</Label>
                <Input
                  id="edit-file"
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setEditingLecture({ ...editingLecture, file: file.name });
                    }
                  }}
                />
              </div>
              <Button onClick={updateLecture}>Update Lecture</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
