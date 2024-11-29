import { client } from "@/server/client";
import { useQuery } from "@tanstack/react-query";

export const useGetCourses = () => {
  return useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const response = await client.api.courses.$get();

      if (!response.ok) {
        throw new Error("No se pudo obtener los cursos");
      }

      return response.json();
    },
  });
};
