import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useUpdateCustomerInfo } from "../api/use-update-customer-info";

interface Props {
  user: {
    id: string;
    name: string;
    lastname: string;
    email: string;
  };
}

const formSchema = z.object({
  id: z.string(),
  name: z.string().min(2, {
    message: "Este campo es requerido.",
  }),
  lastname: z.string().min(2, {
    message: "Este campo es requerido.",
  }),
  email: z.string().email({
    message: "Este campo es requerido.",
  }),
});

const ProfileForm = ({ user }: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    values: {
      id: user.id,
      name: user.name,
      lastname: user.lastname,
      email: user.email,
    },
    resolver: zodResolver(formSchema),
  });

  const updateCustomer = useUpdateCustomerInfo();

  function onSubmit(values: z.infer<typeof formSchema>) {
    updateCustomer.mutate(values);
  }
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="e@correo.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input placeholder="Nombre" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apellido</FormLabel>
                <FormControl>
                  <Input placeholder="Apellido" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            className="w-full"
            type="submit"
            disabled={updateCustomer.isPending}
          >
            {updateCustomer.isPending ? "Actualizando..." : "Actualizar"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ProfileForm;
