import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { validateVerificationCode } from "@/lib/auth-actions";
import React from "react";
import Image from "next/image";
import UpdatePassword from "@/features/auth/components/update-password";

interface Props {
  params: Promise<{ id: string }>;
}

const PassowrdResetRequest = async ({ params }: Props) => {
  const { id } = await params;

  const { status } = await validateVerificationCode(id);

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
              No encontramos tu registro, verifica nuevamente o contactanos por{" "}
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
    <div className="flex flex-col h-screen items-center justify-center ">
      <UpdatePassword code={id} />
    </div>
  );
};

export default PassowrdResetRequest;
