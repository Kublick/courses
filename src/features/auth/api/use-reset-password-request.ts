import { client } from "@/server/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const useResetPasswordRequest = () => {
  return useMutation({
    mutationFn: async (json: { email: string }) => {
      const { email } = json;

      const response = await client.api.auth["reset-request"].$post({
        json: {
          email,
        },
      });

      if (!response.ok) {
        throw new Error("No se generar un codigo");
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success("Instrucciones enviadas a tu correo");
    },
  });
};
