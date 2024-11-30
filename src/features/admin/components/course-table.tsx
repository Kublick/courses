"use client";
import React from "react";
import { useGetCourses } from "../api/use-get-courses";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

const CourseTable = () => {
  const { data, isLoading } = useGetCourses();

  if (isLoading) return <div>Loading...</div>;

  if (!data || data.length === 0) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-center text-sm text-muted-foreground">
          No hay cursos disponibles
        </p>
      </div>
    );
  }

  const formatCurrency = (
    amount: number,
    locale = "en-US",
    currency = "USD"
  ) => {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  return (
    <div className="pt-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="max-w-lg">Nombre</TableHead>
            <TableHead>Descripcion</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Cantidad</TableHead>
            <TableHead>Videos</TableHead>
            <TableHead className="text-center">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((data) => (
            <TableRow key={data.id}>
              <TableCell>{data.title}</TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {data.description}
              </TableCell>
              <TableCell>
                {!data.is_published ? (
                  <Badge variant="active">Publicado</Badge>
                ) : (
                  <Badge variant="destructive">Pendiente</Badge>
                )}
              </TableCell>
              <TableCell> {formatCurrency(data.price)} USD</TableCell>
              <TableCell> # videos</TableCell>
              <TableCell className="flex justify-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <MoreHorizontal className="w-4 h-4 mr-2" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem asChild>
                      <Link href={`/admin/cursos/${data.slug}`}>Editar</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      {data.is_published ? "Desactivar" : "Activar"}
                    </DropdownMenuItem>
                    {/* <DropdownMenuItem>Subscription</DropdownMenuItem> */}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CourseTable;
