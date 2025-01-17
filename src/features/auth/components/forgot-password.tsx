"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";

import { useRouter } from "next/navigation";
import { useResetPasswordRequest } from "../api/use-reset-password-request";

const formSchema = z.object({
  email: z
    .string()
    .email({ message: "Ingrese un email válido" })
    .min(3, "Ingrese un nombre de usuario válido"),
});

export function ForgotPassword() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const requestReset = useResetPasswordRequest();

  function onSubmit(data: z.infer<typeof formSchema>) {
    requestReset.mutate(data);
    router.push("/auth/login");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">
              <Image
                src="/incrementalogo.png"
                width={1705}
                height={529}
                className="mx-auto"
                alt="Incrementa Logo"
              />
            </CardTitle>
            <CardDescription>
              Ingresa tu correo electronico para reiniciar tu contraseña
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo electrónico</FormLabel>
                    <FormControl>
                      <Input placeholder="e@email.com" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Restablecer</Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
