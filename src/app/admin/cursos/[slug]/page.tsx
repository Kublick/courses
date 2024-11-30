import UpdateCourse from "@/features/admin/components/update-course";
import React from "react";

const CoursesById = async ({ params }: { params: { slug: string } }) => {
  const { slug } = await params;

  return (
    <div>
      <UpdateCourse slug={slug} />
    </div>
  );
};

export default CoursesById;
