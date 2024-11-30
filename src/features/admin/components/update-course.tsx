"use client";
import { useGetCourse } from "@/features/admin/api/use-get-course";
import { Loader2 } from "lucide-react";

interface Props {
  slug: string;
}

const UpdateCourse = ({ slug }: Props) => {
  const { data, isLoading, error } = useGetCourse(slug);
  console.log("🚀 ~ UpdateCourse ~ error:", error);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-4 h-screen">
        <Loader2 className="animate-spin" /> Cargando Datos...
      </div>
    );
  }

  if (!data) {
    return <div>No existe data</div>;
  }

  return <div>{JSON.stringify(error)}</div>;
};

export default UpdateCourse;
