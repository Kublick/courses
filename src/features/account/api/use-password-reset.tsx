import { client } from "@/server/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const usePasswordReset = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      password: string;
      id: string;
      currentPassword: string;
    }) => {
      const { id, password, currentPassword } = data;

      const response = await client.api.users[":id"].password.$patch({
        param: { id },
        json: {
          password,
          currentPassword,
        },
      });

      if (!response.ok) {
        console.log(response.status);
        if (response.status === 409) {
          throw new Error("La contraseña actual es incorrecta");
        }

        throw new Error("Failed to update password");
      }

      return response;
    },

    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["customer-info"] });
      toast.success("Contraseña actualizada");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
