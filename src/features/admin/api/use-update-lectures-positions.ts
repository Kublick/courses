import { client } from "@/server/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UpdateSectionPosition {
  id: string;
  position: number;
}

export const useUpdateSectionPosition = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: UpdateSectionPosition[]) => {
      const response = await client.api.sections.position.$post({
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
