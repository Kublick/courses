import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";
import * as React from "react";

interface ActivateAccountProps {
  name?: string;
}

const baseUrl = process.env.NEXT_PUBLIC_URL
  ? `https://${process.env.NEXT_PUBLIC_URL}`
  : "http://localhost:3000";

export const EmailPasswordConfirmation = ({ name }: ActivateAccountProps) => {
  return (
    <Html>
      <Head />

      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
            <Section className="mt-[32px]">
              <Img
                src={`${baseUrl}/incrementalogo.png`}
                width="300"
                alt="Incrementa tu consulta"
                className="my-0 mx-auto"
              />
            </Section>
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              Hola
            </Heading>
            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
            <Text className="text-black text-[14px] leading-[24px]">
              Tu contraseña fue actualizada
            </Text>
            <Text className="text-black text-[14px] leading-[24px]"></Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default EmailPasswordConfirmation;
