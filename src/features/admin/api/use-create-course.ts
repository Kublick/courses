import { client } from "@/server/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { insertCourseSchema } from "../../../server/db/schema";
import { z } from "zod";

export const useCreateCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (json: z.infer<typeof insertCourseSchema>) => {
      const { title, description, price } = json;

      const response = await client.api.courses.$post({
        json: {
          title,
          description,
          price,
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
