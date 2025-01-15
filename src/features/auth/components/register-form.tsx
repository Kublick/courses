"use client";
import { insertCustomerSchema } from "@/server/db/schema";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { useCreateCustomer } from "../api/use-create-customer";
import { useEffect } from "react";

export const registerCustomerSchema = insertCustomerSchema
  .extend({
    password: z.string(),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Los password deben ser iguales",
    path: ["password_confirmation"],
  });

const RegisterForm = ({ email }: { email: string }) => {
  const form = useForm<z.infer<typeof registerCustomerSchema>>({
    resolver: zodResolver(registerCustomerSchema),
    defaultValues: {
      name: "",
      lastname: "",
      password: "",
      password_confirmation: "",
    },
  });

  useEffect(() => {
    form.reset({
      email: email,
    });
  }, [email]);

  const createCustomer = useCreateCustomer();

  function onSubmit(values: z.infer<typeof registerCustomerSchema>) {
    createCustomer.mutate(values);
  }
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="w-full max-w-lg p-8">
            <CardHeader>
              <CardTitle className="text-2xl">
                <p className="py-4 text-center">Registro a la plataforma</p>
                <Image
                  src="/incrementalogo.png"
                  width={1705}
                  height={529}
                  className="mx-auto"
                  alt="Incrementa Logo"
                  priority={true}
                />
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="email"
                  disabled={true}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="email"
                          {...field}
                          value={field.value ?? ""}
                        />
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
                        <Input
                          placeholder="nombre"
                          {...field}
                          value={field.value ?? ""}
                        />
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
                        <Input
                          placeholder="Apellido"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="password"
                          type="password"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password_confirmation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmar Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="password"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button type="submit">Registrar</Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default RegisterForm;
