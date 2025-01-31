import { client } from "@/server/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useUpdateCustomerInfo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: string;
      name: string;
      lastname: string;
      email: string;
    }) => {
      const { id, name, lastname, email } = data;

      const response = await client.api.users[":id"].$patch({
        param: { id },
        json: {
          name,
          lastname,
          email,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to update the lecture");
      }

      return response;
    },

    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["customer-info"] });
      toast.success("Información actualizada");
    },
    onError: (error: Error) => {
      console.error("Update lecture error:", error.message);
    },
  });
};
