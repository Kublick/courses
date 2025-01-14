import { Button } from "@/components/ui/button";
import EmailActivateAccount from "@/features/email/email-activate-account";
const baseUrl = process.env.NEXT_PUBLIC_URL
  ? `https://${process.env.NEXT_PUBLIC_URL}`
  : "";
export default function Home() {
  return (
    <div className="grid items-center justify-items-center  p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Button>Test</Button>
      <img
        src={`/incrementalogo.png`}
        width="300"
        alt="Incrementa tu consulta"
        className="my-0 mx-auto"
      />
    </div>
  );
}
