import { getUser } from "@/server/lib/utils";
import { redirect } from "next/navigation";
import React from "react";

const AdminPage = async () => {
  const { user } = await getUser();

  if (!user || user.role !== "admin") {
    redirect("/auth/login");
  }

  return (
    <div className="p-6">
      <p>Selecciona una opcion</p>
    </div>
  );
};

export default AdminPage;
