"use client";
import { useGetCourse } from "@/features/admin/api/use-get-course";
import { useParams } from "next/navigation";

import React from "react";

const CoursesById = () => {
  const params = useParams<{ id: string }>();

  if (!params) {
    return <p>Waiting for params</p>;
  }

  const { data, isLoading } = useGetCourse(params.id);

  console.log(data);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <div>{JSON.stringify(params)}</div>;
};

export default CoursesById;
