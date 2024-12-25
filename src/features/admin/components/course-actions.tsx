"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, X, Edit2, Eye } from "lucide-react";

export default function CourseActions() {
  const menuItems = [
    { icon: <Edit2 className="mr-2 h-4 w-4" />, label: "Editar" },
    { icon: <Eye className="mr-2 h-4 w-4" />, label: "Publicar" },
    { icon: <X className="mr-2 h-4 w-4" />, label: "Eliminar" },
  ];

  return (
    <DropdownMenu>
      <div className="flex justify-end">
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
      </div>
      <DropdownMenuContent className="w-56" align="end">
        {menuItems.map((item, index) => (
          <DropdownMenuItem key={index} className="flex items-center">
            {item.icon}
            <span>{item.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
