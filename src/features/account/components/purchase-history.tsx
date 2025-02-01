"use client";

import React from "react";
import { useGetPurchases } from "../api/use-get-purchases";
import { Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Props {
  id: string;
}

const PurchaseHistory = ({ id }: Props) => {
  const { data: invoices, isLoading } = useGetPurchases(id);

  if (isLoading) {
    return <Loader2 className="size-6 animate-spin" />;
  }

  if (!invoices) {
    return <p>No hay compras</p>;
  }

  return (
    <Table>
      <TableCaption>Tus compras</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Id</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Metodo</TableHead>
          <TableHead>Producto</TableHead>
          <TableHead className="text-right">Cantidad</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell className="font-medium">{invoice.order_id}</TableCell>
            <TableCell>{invoice.payment_status}</TableCell>
            <TableCell>{invoice.payment_method}</TableCell>
            <TableCell>{invoice.product.title}</TableCell>
            <TableCell className="text-right">${invoice.price / 100}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default PurchaseHistory;
