import { client } from "@/server/client";
import { useQuery } from "@tanstack/react-query";

export const useGetCustomer = (id: string) => {
  return useQuery({
    queryKey: ["customer-info", id],
    queryFn: async () => {
      const response = await client.api.users[":id"].$get({
        param: { id },
      });

      if (!response.ok) {
        throw new Error("No se pudo obtener el usuario");
      }

      return await response.json();
    },
  });
};
