// "use client";
// import React, { useEffect } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Button } from "@/components/ui/button";
// import { Edit2 } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { insertLectureSchema } from "@/server/db/schema";
// import { z } from "zod";
// import { Textarea } from "@/components/ui/textarea";
// import { useUpdateLecture } from "../api/use-update-lecture";

// const MAX_FILE_SIZE = 50 * 1024 * 1024; // 10MB
// const ACCEPTED_VIDEO_TYPES = [
//   "video/mp4",
//   "video/mpeg",
//   "video/quicktime",
//   "video/x-msvideo",
//   "video/webm",
// ];

// export const lectureFormSchema = z.object({
//   title: z.string().min(1, { message: "El título es obligatorio" }),
//   description: z.string().optional(),
//   section_id: z.string(),
//   position: z.number(),
//   file: z
//     .union([z.instanceof(File), z.null(), z.undefined()])
//     .refine(
//       (file) => {
//         return (
//           file === null || file === undefined || file.size <= MAX_FILE_SIZE
//         );
//       },
//       {
//         message: "El archivo debe ser de 50MB o menos",
//       }
//     )
//     .refine(
//       (file) => {
//         // Ensure the file type is valid for videos
//         return (
//           file === null ||
//           file === undefined ||
//           ACCEPTED_VIDEO_TYPES.includes(file.type)
//         );
//       },
//       {
//         message:
//           "Por favor, sube un archivo de video válido (mp4, mpeg, mov, avi, webm)",
//       }
//     ),
// });

// interface Props {
//   title: string;
//   description: string;
//   section_id: string;
//   position: number;
//   id: string;
// }

// const UpdateLecture = ({
//   id,
//   title,
//   description,
//   section_id,
//   position,
// }: Props) => {
//   const [open, setOpen] = React.useState(false);

//   const form = useForm<z.infer<typeof lectureFormSchema>>({
//     resolver: zodResolver(lectureFormSchema),
//     defaultValues: {
//       title,
//       description,
//       section_id,
//       position,
//     },
//   });

//   useEffect(() => {
//     form.reset({ title, description, section_id, position });
//   }, [title, description, section_id, position, form]);

//   const updateLecture = useUpdateLecture();

//   function onSubmit(values: z.infer<typeof insertLectureSchema>) {
//     updateLecture.mutate({
//       id,
//       title: values.title,
//       description: values.description,
//       section_id: values.section_id,
//       position: values.position,
//       content_type: "video",
//       content_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
//     });
//     form.reset();
//     setOpen(false);
//   }

//   return (
//     <></>
//     // <Form {...form}>
//     //   <form onSubmit={form.handleSubmit(onSubmit)}>
//     //     <Dialog open={open} onOpenChange={setOpen}>
//     //       <DialogTrigger asChild>
//     //         <Button variant="ghost">
//     //           <Edit2 size="icon" />
//     //         </Button>
//     //       </DialogTrigger>
//     //       <DialogContent>
//     //         <DialogHeader>
//     //           <DialogTitle>Crear Nueva Lección</DialogTitle>
//     //           <DialogDescription asChild>
//     //             <div className="space-y-6">
//     //               <FormField
//     //                 control={form.control}
//     //                 name="title"
//     //                 render={({ field }) => (
//     //                   <FormItem>
//     //                     <FormLabel>Título</FormLabel>
//     //                     <FormControl>
//     //                       <Input placeholder="Título" {...field} />
//     //                     </FormControl>
//     //                     <FormMessage />
//     //                   </FormItem>
//     //                 )}
//     //               />
//     //               <FormField
//     //                 control={form.control}
//     //                 name="description"
//     //                 render={({ field }) => (
//     //                   <FormItem>
//     //                     <FormLabel>Descripción</FormLabel>
//     //                     <FormControl>
//     //                       <Textarea placeholder="Descripción" {...field} />
//     //                     </FormControl>
//     //                     <FormMessage />
//     //                   </FormItem>
//     //                 )}
//     //               />
//     //               <FormField
//     //                 control={form.control}
//     //                 name="file"
//     //                 render={({ field }) => (
//     //                   <FormItem>
//     //                     <FormLabel>Archivo</FormLabel>
//     //                     <FormControl>
//     //                       <Input
//     //                         type="file"
//     //                         accept="video/*"
//     //                         onChange={(event) => {
//     //                           const file = event.target.files?.[0] || null;
//     //                           field.onChange(file);
//     //                           form.trigger("file");
//     //                         }}
//     //                       />
//     //                     </FormControl>
//     //                     <FormMessage />
//     //                   </FormItem>
//     //                 )}
//     //               />
//     //             </div>
//     //           </DialogDescription>
//     //         </DialogHeader>
//     //         <DialogFooter>
//     //           <Button
//     //             type="submit"
//     //             onClick={async () => {
//     //               await form.trigger();
//     //               if (form.formState.isValid) {
//     //                 onSubmit(form.getValues());
//     //               }
//     //             }}
//     //           >
//     //             Registrar
//     //           </Button>
//     //         </DialogFooter>
//     //       </DialogContent>
//     //     </Dialog>
//     //   </form>
//     // </Form>
//   );
// };

// export default UpdateLecture;
