import { client } from "@/server/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

export const useCreateLecture = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      title: string;
      description: string;
      file: File;
      section_id: string;
      position: number;
    }) => {
      const { title, description, file, section_id, position } = data;

      // Create a FormData object
      const formObject = {
        title,
        description,
        file,
        section_id,
        position: position.toString(),
      };

      const response = await client.api.lectures.$post({
        form: formObject,
      });

      if (!response.ok) {
        throw new Error("Failed to create the lecture");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lectures"] });
    },
  });
};
