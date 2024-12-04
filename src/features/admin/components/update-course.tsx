// "use client";
// import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { useGetCourse } from "@/features/admin/api/use-get-course";
// import {
//   DndContext,
//   DragEndEvent,
//   DragOverEvent,
//   DragOverlay,
//   DragStartEvent,
//   PointerSensor,
//   useSensor,
//   useSensors,
// } from "@dnd-kit/core";
// import { createPortal } from "react-dom";
// import { Loader2, Plus } from "lucide-react";
// import { useMemo, useState } from "react";
// import { arrayMove, SortableContext } from "@dnd-kit/sortable";
// import SortableLecture from "./sortable-lecture";
// import SortableSections from "./sortable-sections";
// import ColumnContainer from "./column-container";

// export type Column = {
//   id: number;
//   title: string;
// };

// export type Task = {
//   lecture: Lecture;
//   columnId: string | number;
// };

// export interface Lecture {
//   id: number | string;
//   title: string;
//   description: string;
//   content_type: string;
//   content_url: string;
//   created_at: Date;
// }

// export interface Section {
//   id: number | string;
//   title: string;
//   lectures: Lecture[];
// }

// interface Props {
//   slug: string;
// }

// function generateId() {
//   return Math.floor(Math.random() * 10001);
// }

// const UpdateCourse = ({ slug }: Props) => {
//   const { data, isLoading } = useGetCourse(slug);

//   const sensors = useSensors(
//     useSensor(PointerSensor, {
//       activationConstraint: {
//         distance: 100,
//       },
//     })
//   );

//   const [columns, setColumns] = useState<Column[]>([
//     {
//       id: generateId(),
//       title: "Lecciones Disponibles",
//     },
//     {
//       id: generateId(),
//       title: "Inicio",
//     },
//     {
//       id: generateId(),
//       title: "Como incrementar tus ganancias",
//     },
//     {
//       id: generateId(),
//       title: "Los 5 pasos de una venta",
//     },
//   ]);

//   const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

//   const [activeColumn, setActiveColumn] = useState<Column | null>(null);

//   // Initial state with all lectures unassigned
//   const [tasks, setTasks] = useState<Task[]>([
//     {
//       lecture: {
//         id: "AA",
//         title: "Introducción",
//         description: "Descripción del curso",
//         content_type: "video",
//         content_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
//         created_at: new Date(),
//       },
//       columnId: columns[0].id,
//     },
//     {
//       lecture: {
//         id: "BB",
//         title: "Induccion",
//         description: "Descripción del curso",
//         content_type: "video",
//         content_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
//         created_at: new Date(),
//       },
//       columnId: columns[0].id,
//     },
//     {
//       lecture: {
//         id: "CC",
//         title: "La lista de pacientes",
//         description: "Crece a tus pacientes",
//         content_type: "video",
//         content_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
//         created_at: new Date(),
//       },
//       columnId: columns[0].id,
//     },
//   ]);
//   const [activeTask, setActiveTask] = useState<Task | null>(null);

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center gap-4 h-screen">
//         <Loader2 className="animate-spin" /> Cargando Datos...
//       </div>
//     );
//   }

//   if (!data) {
//     return <div>No existe data</div>;
//   }

//   const onHandleDragStart = (event: DragStartEvent) => {
//     console.log("start drag", event.active.data.current?.type);

//     if (event.active.data.current?.type === "column") {
//       setActiveColumn(event.active.data.current.column);
//       return;
//     }

//     if (event.active.data.current?.type === "lecture") {
//       setActiveTask(event.active.data.current.column);
//       return;
//     }
//   };

//   const handleDragEnd = (event: DragEndEvent) => {
//     const { active, over } = event;

//     if (!over) return;

//     const activeColumnId = active.id;
//     const overColumnId = over.id;

//     if (activeColumnId === overColumnId) {
//       return;
//     }

//     setColumns((columns) => {
//       const activeColumnIndex = columns.findIndex(
//         (col) => col.id === activeColumnId
//       );
//       const overColumnIndex = columns.findIndex(
//         (col) => col.id === overColumnId
//       );

//       return arrayMove(columns, activeColumnIndex, overColumnIndex);
//     });
//   };

//   const handleDragOver = (event: DragOverEvent) => {
//     const { active, over } = event;

//     if (!over) return;

//     const activeColumnId = active.id;
//     const overColumnId = over.id;

//     if (activeColumnId === overColumnId) {
//       return;
//     }

//     setColumns((columns) => {
//       const activeColumnIndex = columns.findIndex(
//         (col) => col.id === activeColumnId
//       );
//       const overColumnIndex = columns.findIndex(
//         (col) => col.id === overColumnId
//       );

//       return arrayMove(columns, activeColumnIndex, overColumnIndex);
//     });
//   };

//   return (
//     <div className="p-6">
//       <Card className="max-w-sm mb-6">
//         <CardHeader>{data.title}</CardHeader>
//         <CardContent>
//           <p>{data.description}</p>
//           <p>{data.price}</p>
//         </CardContent>
//       </Card>

//       <DndContext
//         onDragEnd={handleDragEnd}
//         onDragOver={handleDragOver}
//         onDragStart={onHandleDragStart}
//         sensors={sensors}
//       >
//         <div className="flex gap-8">
//           {/* Lecciones column */}
//           {/* <div className="h-36 bg-teal-100 min-w-64 flex items-center justify-center">
//             {columns[0].title}
//           </div> */}

//           {/* Sections column */}
//           <SortableContext items={columnsId}>
//             <div className="flex gap-4">
//               {columns.map((column) => (
//                 <ColumnContainer
//                   key={column.id}
//                   column={column}
//                   tasks={tasks.filter((task) => task.columnId === column.id)}
//                 />
//               ))}
//             </div>
//           </SortableContext>
//         </div>
//         {/* {createPortal(
//           <DragOverlay>
//             {activeColumn && (
//               <ColumnContainer column={activeColumn} tasks={[]} />
//             )}
//           </DragOverlay>,
//           document.body
//         )} */}
//       </DndContext>
//     </div>
//   );
// };

// export default UpdateCourse;
"use client";
import React from "react";
import { useGetCourse } from "../api/use-get-course";
import { Loader2 } from "lucide-react";

interface Props {
  slug: string;
}

const UpdateCourse = ({ slug }: Props) => {
  const { data, isLoading } = useGetCourse(slug);

  if (isLoading) {
    return (
      <div>
        <Loader2 className="animate-spin" /> Cargando Datos...
      </div>
    );
  }

  if (!data) {
    return <div>No existen curso</div>;
  }

  console.log("data", data);

  return <div>UpdateCourse</div>;
};

export default UpdateCourse;
