import EnrollementsPage from "@/features/clients/components/enrollements";
import { Header } from "@/features/clients/components/header";
import { getUser } from "@/server/lib/utils";
import { redirect } from "next/navigation";
import React from "react";

const ClientesPage = async () => {
  const { user, session } = await getUser();

  if (!session || !user) {
    redirect("/auth/login");
  }

  return (
    <div>
      <Header user={user} />
      <EnrollementsPage />
    </div>
  );
};

export default ClientesPage;
