import CourseSection from "@/features/clients/components/course-section";
import React from "react";
type Params = Promise<{ slug: string }>;

const PageBySlug = async ({ params }: { params: Params }) => {
  const { slug } = await params;

  return (
    <div>
      <CourseSection slug={slug} />
    </div>
  );
};

export default PageBySlug;
