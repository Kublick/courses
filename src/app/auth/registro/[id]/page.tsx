import { Card, CardContent, CardHeader } from "@/components/ui/card";
import RegisterForm from "@/features/auth/components/register-form";
import { validateVerificationCode } from "@/lib/auth-actions";
import React from "react";
import Image from "next/image";
interface Props {
  params: Promise<{ id: string }>;
}

const CustomerRegistration = async ({ params }: Props) => {
  const { id } = await params;

  const { status, email } = await validateVerificationCode(id);

  if (status === false) {
    return (
      <div className="flex flex-col h-screen items-center justify-center ">
        <Card className="max-w-sm">
          <CardHeader>
            <Image
              src="/incrementalogo.png"
              width={1705}
              height={529}
              className="mx-auto"
              alt="Incrementa Logo"
            />
          </CardHeader>
          <CardContent>
            <p className="text-center">
              No encontramos tu registro, verifica nuevamnete o contactanos por{" "}
              <a
                href="mailto:soporte@incrementatuconsulta.com"
                className="hover:underline"
              >
                correo
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <RegisterForm email={email} />
    </div>
  );
};

export default CustomerRegistration;
