import { client } from "@/server/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateLecture = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: string;
      title: string;
      description?: string;
      file?: File;
      thumbnail?: File;
    }) => {
      const { id, title, description, file, thumbnail } = data;

      // Prepare form data object
      const formObject = {
        title,
        ...(description !== undefined && { description }),
        ...(file && { file }),
        ...(thumbnail && { thumbnail }),
      };

      const response = await client.api.lectures[":id"].$patch({
        param: { id },
        form: formObject,
      });

      if (!response.ok) {
        throw new Error("Failed to update the lecture");
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["lectures"] });
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["lecture"] });
    },
    onError: (error: Error) => {
      console.error("Update lecture error:", error.message);
    },
  });
};
