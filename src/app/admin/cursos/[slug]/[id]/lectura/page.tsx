import LectureForm from "@/features/admin/components/lecture-form";
import React from "react";

interface LecturaPageProps {
  params: Promise<{
    slug: string; // Changed from 'curso' to match the folder structure
    id: string;
  }>;
  searchParams: Promise<{
    numero?: string;
  }>;
}

const NewLecturePage = async ({ params, searchParams }: LecturaPageProps) => {
  const { slug, id: sectionId } = await params;
  const { numero: lectureNumber } = await searchParams;

  return (
    <div className="p-4">
      <LectureForm
        slug={slug}
        section_id={sectionId}
        lecturesLength={lectureNumber ? parseInt(lectureNumber) : 0}
      />
    </div>
  );
};

export default NewLecturePage;
