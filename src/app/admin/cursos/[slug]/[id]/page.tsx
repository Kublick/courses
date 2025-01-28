import UpdateLecture from "@/features/admin/components/update-lecture";
import React from "react";

interface LecturaPageProps {
  params: Promise<{
    slug: string;
    id: string;
  }>;
}

const UpdateLectureById = async ({ params }: LecturaPageProps) => {
  const { slug, id: lectureId } = await params;

  return (
    <div className="container p-4">
      <UpdateLecture lectureId={lectureId} slug={slug} />
    </div>
  );
};

export default UpdateLectureById;
