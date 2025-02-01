import { client } from "@/server/client";
import { useQuery } from "@tanstack/react-query";

export const useGetPurchases = (id: string) => {
  return useQuery({
    queryKey: ["purchases", id],
    queryFn: async () => {
      const response = await client.api.payments.customer[":customerId"].$get({
        param: { customerId: id },
      });

      if (!response.ok) {
        throw new Error("No se pudo obtener las compras");
      }

      return response.json();
    },
  });
};
