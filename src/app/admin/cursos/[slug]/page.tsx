import Course from "@/features/admin/components/course";
import React from "react";

type Params = Promise<{ slug: string }>;

const CoursesById = async ({ params }: { params: Params }) => {
  const { slug } = await params;

  return (
    <div>
      <Course slug={slug} />
    </div>
  );
};

export default CoursesById;
