import { client } from "@/server/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteSection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (param: { id: string }) => {
      console.log("Param:", param);
      const response = await client.api.sections[":id"].$delete({
        param: {
          id: param.id,
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
