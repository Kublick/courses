"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  PanelRightClose,
  PanelRightOpen,
  PlayCircle,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import Video from "next-video";
import { useGetCourse } from "@/features/admin/api/use-get-course";

// Types for our data structure
type Video = {
  id: string;
  status: string;
  playback_id: string;
  duration: number | null;
};

type Lecture = {
  id: string;
  title: string;
  description: string;
  video?: Video;
  is_published: boolean;
  poster_url: string;
  position: number;
};

type Section = {
  id: string;
  title: string;
  lectures: Lecture[];
  is_published: boolean;
};

type Course = {
  id: string;
  title: string;
  description: string;
  sections: Section[];
};

const DescriptionContent = ({ content }: { content: string }) => {
  return (
    <div
      className="prose prose-invert max-w-none"
      dangerouslySetInnerHTML={{
        __html: content
          .replace(
            /<p[^>]*>/g,
            '<p class="text-gray-200 mb-4 leading-relaxed">'
          )
          .replace(/<ul[^>]*>/g, '<ul class="list-disc pl-6 space-y-2 mb-4">')
          .replace(/<li[^>]*>/g, '<li class="text-gray-200">')
          .replace(/<strong[^>]*>/g, '<strong class="font-bold text-white">'),
      }}
    />
  );
};
interface Props {
  slug: string;
}
export default function SectionCourse({ slug }: Props) {
  const { data: courseData, isLoading } = useGetCourse(slug);
  const [isAsideVisible, setIsAsideVisible] = useState(true);
  const [currentLecture, setCurrentLecture] = useState<Lecture | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set()
  );

  // Sort sections and their lectures by position
  const course = courseData
    ? {
        ...courseData,
        sections: courseData.sections.map((section) => ({
          ...section,
          lectures: [...section.lectures].sort(
            (a, b) => a.position - b.position
          ),
        })),
      }
    : null;

  const toggleAside = () => setIsAsideVisible(!isAsideVisible);

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const selectLecture = (lecture: Lecture) => {
    setCurrentLecture(lecture);
    if (!lecture.video) {
      setIsAsideVisible(false);
    }
  };

  // Handle loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-white">Loading course content...</div>
      </div>
    );
  }

  // Handle case where course data is not available
  if (!course) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-white">Course not found</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row h-screen bg-background dark">
      {/* Main content area with video player */}
      <main className="flex-1 flex flex-col min-h-0 bg-gray-900 text-gray-100">
        <div className="flex-1 relative overflow-hidden bg-black">
          {currentLecture ? (
            currentLecture.video ? (
              <Video
                streamType="on-demand"
                playbackId={currentLecture.video.playback_id}
                metadata={{
                  video_id: currentLecture.video.id,
                  video_title: currentLecture.title,
                }}
                poster={
                  currentLecture.poster_url ||
                  "/placeholder.svg?height=720&width=1280"
                }
                className="absolute inset-0 w-full h-full object-contain"
              />
            ) : (
              <div className="absolute inset-0 flex items-start justify-center p-8 overflow-y-auto">
                <div className="w-full bg-gray-800 rounded-lg p-6">
                  <h2 className="text-2xl font-bold mb-6 text-white">
                    {currentLecture.title}
                  </h2>
                  <DescriptionContent content={currentLecture.description} />
                </div>
              </div>
            )
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-2xl font-bold">Select a lecture to start</p>
            </div>
          )}
        </div>
        {currentLecture && currentLecture.video && (
          <div className="p-4 bg-gray-800">
            <h1 className="text-2xl font-bold mb-2 text-gray-100">
              {currentLecture.title}
            </h1>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div className="text-gray-400">
                <p>
                  Duration: {currentLecture.video.duration?.toFixed(2) || "N/A"}{" "}
                  seconds
                </p>
                <DescriptionContent content={currentLecture.description} />
              </div>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleAside}
                  className="bg-gray-700 hover:bg-gray-600 text-gray-100"
                >
                  {isAsideVisible ? (
                    <PanelRightClose className="h-4 w-4" />
                  ) : (
                    <PanelRightOpen className="h-4 w-4" />
                  )}
                  <span className="sr-only">
                    {isAsideVisible ? "Hide sidebar" : "Show sidebar"}
                  </span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Aside panel */}
      <aside
        className={`w-full sm:w-80 bg-gray-800 text-gray-100 transition-all duration-300 ease-in-out ${
          isAsideVisible ? "translate-x-0" : "translate-x-full"
        } sm:translate-x-0 ${isAsideVisible ? "sm:w-80" : "sm:w-0"}`}
      >
        <ScrollArea className="h-full">
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4 text-gray-100">
              Course Content
            </h2>
            {course.sections.map((section) => (
              <div key={section.id} className="mb-4">
                <button
                  className="flex items-center justify-between w-full text-left p-2 rounded hover:bg-gray-700"
                  onClick={() => toggleSection(section.id)}
                >
                  <span className="font-medium">{section.title}</span>
                  {expandedSections.has(section.id) ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
                {expandedSections.has(section.id) && (
                  <ul className="ml-4 space-y-1 mt-2">
                    {section.lectures.map((lecture) => (
                      <li
                        key={lecture.id}
                        className={`p-2 rounded cursor-pointer hover:bg-gray-700 ${
                          currentLecture?.id === lecture.id ? "bg-gray-700" : ""
                        }`}
                        onClick={() => selectLecture(lecture)}
                      >
                        <div className="flex items-center">
                          <PlayCircle className="h-4 w-4 mr-2 text-gray-400" />
                          <div>
                            <h3 className="font-medium text-sm">
                              {lecture.title}
                            </h3>
                            <p className="text-xs text-gray-400">
                              {lecture.video
                                ? `${lecture.video.duration?.toFixed(2)} seconds`
                                : "Duration N/A"}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </aside>
    </div>
  );
}
