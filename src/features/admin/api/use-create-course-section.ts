import { client } from "@/server/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { insertSectionSchema } from "../../../server/db/schema";
import { z } from "zod";

export const useCreateCourseSection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (json: z.infer<typeof insertSectionSchema>) => {
      const { title, course_id, position } = json;

      const response = await client.api.courses.sections.$post({
        json: {
          title,
          course_id,
          position,
        },
      });

      if (!response.ok) {
        throw new Error("No se pudo crear el curso");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
};
