import { getUser } from "@/server/lib/utils";
import { redirect } from "next/navigation";
import React from "react";

import AdminSidebar from "@/features/admin/components/admin-sidebar";

const AdminPage = async () => {
  const { user } = await getUser();

  if (!user || user.role !== "admin") {
    redirect("/auth/login");
  }

  return <AdminSidebar />;
};

export default AdminPage;
