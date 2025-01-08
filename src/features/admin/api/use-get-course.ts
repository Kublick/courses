import { client } from "@/server/client";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const useGetCourse = (slug: string) => {
  const router = useRouter();

  return useQuery({
    queryKey: ["courses", slug],
    queryFn: async () => {
      const response = await client.api.courses[":slug"].$get({
        param: { slug },
      });

      if (response.status === 404) {
        router.push("/admin/cursos");
      }

      if (!response.ok) {
        throw new Error("No se pudo obtener los cursos");
      }

      const data = await response.json();

      return data;
    },
  });
};
