import { CourseForm } from "@/features/admin/components/course-form";
import CourseTable from "@/features/admin/components/course-table";
import { getUser } from "@/server/lib/utils";
import { redirect } from "next/navigation";
import React from "react";

const CursosPage = async () => {
  // const { user } = await getUser();

  // if (!user || user.role !== "admin") {
  //   redirect("/");
  // }

  return (
    <div className="p-6">
      <CourseForm />
      <CourseTable />
    </div>
  );
};

export default CursosPage;
