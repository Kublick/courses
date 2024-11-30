import { client } from "@/server/client";
import { useQuery } from "@tanstack/react-query";

export const useGetCourse = (slug: string) => {
  return useQuery({
    queryKey: ["courses", slug],
    queryFn: async () => {
      const response = await client.api.courses[":slug"].$get({
        param: { slug },
      });

      if (!response.ok) {
        throw new Error("No se pudo obtener los cursos");
      }

      return response.json();
    },
  });
};
