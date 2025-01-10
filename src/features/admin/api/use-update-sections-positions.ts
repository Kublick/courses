import { client } from "@/server/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateLectureSchema } from "../../../server/db/schema";

interface UpdateLecturePosition {
  id: string;
  position: number;
  sectionId: string;
}

export const useUpdateLecturePositions = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: UpdateLecturePosition[]) => {
      const response = await client.api.lectures.position.$post({
        json: body,
      });

      if (!response.ok) {
        throw new Error("No se pudo reordenar");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
};
