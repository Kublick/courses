import { client } from "@/server/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { z } from "zod";
import { registerCustomerSchema } from "../components/register-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (json: z.infer<typeof registerCustomerSchema>) => {
      const { name, lastname, password, email } = json;

      const response = await client.api.users.customer.$post({
        json: {
          name: name ?? "",
          lastname: lastname ?? "",
          password,
          email,
        },
      });

      if (!response.ok) {
        throw new Error("No se pudo crear el curso");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast.success("Cuenta actualizada");
      router.push("/auth/login");
    },
  });
};
