import { client } from "@/server/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { insertLectureSchema } from "../../../server/db/schema";
import { z } from "zod";

export const useCreateLecture = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (json: z.infer<typeof insertLectureSchema>) => {
      const { title, section_id, position, content_url, content_type } = json;

      const response = await client.api.lectures.$post({
        json: {
          title,
          section_id,
          position,
          content_url,
          content_type,
        },
      });

      if (!response.ok) {
        throw new Error("No se pudo crear la sección");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
};
