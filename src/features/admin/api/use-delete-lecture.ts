import { client } from "@/server/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteLecture = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (param: { id: string }) => {
      const response = await client.api.lectures[":id"].$delete({
        param: {
          id: param.id,
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
