import { client } from "@/server/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const useResetPassword = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: async (json: { password: string; code: string }) => {
      const { password, code } = json;

      const response = await client.api.auth["password-reset"].$post({
        json: {
          password,
          code,
        },
      });

      if (!response.ok) {
        throw new Error("No se generar un codigo");
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success("Password Actualizado");
      router.push("/auth/login");
    },
  });
};
