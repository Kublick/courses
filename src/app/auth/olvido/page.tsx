import { ForgotPassword } from "@/features/auth/components/forgot-password";
import React from "react";

const RequestPasswordReset = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <ForgotPassword />
    </div>
  );
};

export default RequestPasswordReset;
