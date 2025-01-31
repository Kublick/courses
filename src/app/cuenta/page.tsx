import AccountPage from "@/features/account/components/account-page";
import { getUser } from "@/server/lib/utils";
import { redirect } from "next/navigation";
import React from "react";

const Account = async () => {
  const { user, session } = await getUser();

  if (!session || !user) {
    redirect("/auth/login");
  }
  console.log(user);
  return (
    <div>
      <AccountPage id={user.id} />
    </div>
  );
};

export default Account;
