import { client } from "@/server/client";
import { useQuery } from "@tanstack/react-query";

import { z } from "zod";

export const useGetLecture = (id: string) => {
  return useQuery({
    queryKey: ["lectureById", id],
    queryFn: async () => {
      const response = await client.api.lectures[":id"].$get({
        param: { id },
      });

      if (!response.ok) {
        throw new Error("No se pudo obtener la lección");
      }

      return response.json();
    },
  });
};
