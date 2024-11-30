import { CourseForm } from "@/features/admin/components/course-form";
import CourseTable from "@/features/admin/components/course-table";
import React from "react";

const CursosPage = () => {
  return (
    <div className="p-6">
      <CourseForm />
      <CourseTable />
    </div>
  );
};

export default CursosPage;
