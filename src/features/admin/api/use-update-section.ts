import { client } from "@/server/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateSection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, title }: { id: string; title: string }) => {
      const response = await client.api.sections[":id"].$put({
        param: {
          id: id,
        },
        json: {
          title,
        },
      });

      if (!response.ok) {
        throw new Error("No se pudo eliminar la sección");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
};
