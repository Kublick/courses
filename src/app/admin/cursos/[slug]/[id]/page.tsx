import UpdateLecture from "@/features/admin/components/update-lecture";
import React from "react";

interface Params {
  id: string;
}

const UpdateLectureById = async ({ params }: { params: Params }) => {
  const { id } = await params;

  return (
    <div>
      <UpdateLecture id={id} />
    </div>
  );
};

export default UpdateLectureById;
