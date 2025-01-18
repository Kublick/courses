import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Curso",
  description: "Curso",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="p-4 bg-[#0e1012] text-white h-screen">{children}</div>;
}
