import AccountPage from "@/features/account/components/account-page";
import { getUser } from "@/server/lib/utils";
import { getCardType } from "@/server/routes/webhooks/webhooks.handler";
import { redirect } from "next/navigation";
import React from "react";

const Account = async () => {
  const { user, session } = await getUser();

  const intent = await getCardType("pi_3QnS04EPP9iiw0Am0RrI7A5O");

  console.log(intent);

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
