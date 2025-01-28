import LectureForm from "@/features/admin/components/lecture-form";
import React from "react";

interface LecturaPageProps {
  params: Promise<{
    slug: string;
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
    <div className="container mx-auto">
      <LectureForm
        slug={slug}
        section_id={sectionId}
        lecturesLength={lectureNumber ? parseInt(lectureNumber) : 0}
      />
    </div>
  );
};

export default NewLecturePage;
