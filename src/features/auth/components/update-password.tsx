"use client";

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
import { useResetPassword } from "../api/use-reset-password";

const formSchema = z
  .object({
    password: z.string(),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Los password deben ser iguales",
    path: ["password_confirmation"],
  });

interface Props {
  code: string;
}

const UpdatePassword = ({ code }: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      password_confirmation: "",
    },
  });

  const resetPassword = useResetPassword();

  function onSubmit(values: z.infer<typeof formSchema>) {
    resetPassword.mutate({ password: values.password, code });
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="w-full max-w-lg p-8">
            <CardHeader>
              <CardTitle className="text-2xl">
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
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contraseña</FormLabel>
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
                      <FormLabel>Confirmar Contraseña</FormLabel>
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
              <Button type="submit">Actualizar</Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default UpdatePassword;
