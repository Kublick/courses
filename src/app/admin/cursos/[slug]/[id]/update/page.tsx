import React from "react";
import UpdateLecture from "@/features/admin/components/update-lecture";

interface LecturaPageProps {
  params: Promise<{
    slug: string;
    id: string;
  }>;
  searchParams: Promise<{
    numero?: string;
  }>;
}

const UpdateLecturePage = async ({ params }: LecturaPageProps) => {
  const { slug, id: lectureId } = await params;

  return (
    <div className="container mx-auto">
      <UpdateLecture lectureId={lectureId} slug={slug} />
    </div>
  );
};

export default UpdateLecturePage;
