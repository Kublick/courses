"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MoreVertical, X, Edit2, Eye } from "lucide-react";
import { useDeleteLecture } from "../api/use-delete-lecture";
import { useState } from "react";

interface Props {
  lectureId: string;
}

const LectureAction = ({ lectureId }: Props) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { mutate: deleteLecture } = useDeleteLecture();

  const handleDelete = async () => {
    try {
      deleteLecture({ id: lectureId });
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to delete lecture:", error);
    }
  };

  const menuItems = [
    {
      icon: <Edit2 className="mr-2 h-4 w-4" />,
      label: "Editar",
      onClick: () => {
        // Handle edit logic here
      },
    },
    {
      icon: <Eye className="mr-2 h-4 w-4" />,
      label: "Publicar",
      onClick: () => {
        // Handle publish logic here
      },
    },
    {
      icon: <X className="mr-2 h-4 w-4 text-rose-600" />,
      label: "Eliminar",
      onClick: () => setIsDialogOpen(true),
    },
  ];

  return (
    <>
      <DropdownMenu>
        <div className="flex justify-end">
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
            >
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
        </div>
        <DropdownMenuContent className="w-56" align="end">
          {menuItems.map((item, index) => (
            <DropdownMenuItem
              key={index}
              className="flex items-center"
              onClick={item.onClick}
            >
              {item.icon}
              <span>{item.label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Lectura</DialogTitle>
            <DialogDescription>
              ¿Estás seguro que deseas eliminar esta lectura? Esta acción no se
              puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="destructive" onClick={handleDelete}>
              Eliminar
            </Button>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LectureAction;