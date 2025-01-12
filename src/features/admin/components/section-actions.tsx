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
import { useState } from "react";
import { useDeleteSection } from "../api/use-delete-section";
import { Input } from "@/components/ui/input";
import { useUpdateSection } from "../api/use-update-section";
import { toast } from "sonner";

interface Props {
  sectionId: string;
  is_published: boolean;
  title: string;
}

const SectionActions = ({ sectionId, is_published, title }: Props) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editName, setEditName] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const { mutate: deleteSection } = useDeleteSection();
  const { mutate: updateSection } = useUpdateSection();

  const handleDelete = async () => {
    try {
      deleteSection({ id: sectionId });
      setIsDialogOpen(false);
      toast.success("Seccion Eliminada");
    } catch (error) {
      toast.error(
        "Ocurrio un error al eliminar la sección, intente nuevamente"
      );
      console.error("Failed to delete section:", error);
    }
  };

  const handleUpdateTitle = async () => {
    try {
      updateSection({ id: sectionId, title: newTitle });
      setNewTitle("");
      setEditName(false);
      toast.success("Titulo de la sección actualizado");
    } catch (error) {
      console.log("failed to update section name", error);
      toast.error("Ocurrio un error intente nuevamente");
    }
  };

  const menuItems = [
    {
      icon: <Edit2 className="mr-2 h-4 w-4" />,
      label: "Editar",
      onClick: () => setEditName(true),
    },
    {
      icon: <Eye className="mr-2 h-4 w-4" />,
      label: !is_published ? "Publicar" : "Remover",
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
            <DialogTitle>Eliminar Sección</DialogTitle>
            <DialogDescription>
              ¿Estás seguro que deseas eliminar esta seccion? Esta acción no se
              puede deshacer, se eliminaran todas las lecciones.
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

      {/* Update title */}

      <Dialog open={editName} onOpenChange={setEditName}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Actualizar nombre de la sección</DialogTitle>
            <DialogDescription>
              <Input
                onChange={(e) => setNewTitle(e.target.value)}
                value={newTitle}
              />
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button onClick={handleUpdateTitle}>Actualizar</Button>
            <Button
              variant="outline"
              onClick={() => {
                setNewTitle("");
                setEditName(false);
              }}
            >
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SectionActions;
