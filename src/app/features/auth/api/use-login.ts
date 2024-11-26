import { client } from "@/server/client";
import { useMutation } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { toast } from "sonner";

export const useLogin = () => {
  const mutation = useMutation({
    mutationFn: async (json: { email: string; password: string }) => {
      const { email, password } = json;

      try {
        const response = await client.api.auth.login.$post({
          json: { email, password },
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Problemas al ingresar");
        }

        toast.success("Ingreso Exitoso");
        return result;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Ingreso Exitoso");
      redirect("/");
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Hubo un error, contacte al administrador.");
      }
    },
  });
  return mutation;
};
