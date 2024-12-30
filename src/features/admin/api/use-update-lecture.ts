import { client } from "@/server/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateLectureSchema } from "../../../server/db/schema";
import { z } from "zod";

export const useUpdateLecture = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...json
    }: { id: string } & z.infer<typeof updateLectureSchema>) => {
      const { title, description, section_id, position, content_type } = json;

      const response = await client.api.lectures[":id"].$put({
        param: { id },
        json: {
          title,
          description,
          section_id,
          position,
          content_type,
        },
      });

      if (!response.ok) {
        throw new Error("No se pudo actualizar la lectura");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
};
