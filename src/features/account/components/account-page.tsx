"use client";
import { Button } from "@/components/ui/button";
import { User, Lock, ShoppingBag, ChevronLeft, ArrowLeft } from "lucide-react";
import React, { useState } from "react";
import ProfileForm from "./profile-form";
import { useGetCustomer } from "../api/use-get-customer";
import PasswordResetForm from "./password-reset-form";
import PurchaseHistory from "./purchase-history";
import Link from "next/link";

interface Props {
  id: string;
}

const AccountPage = ({ id }: Props) => {
  const { data, isLoading } = useGetCustomer(id);
  console.log("🚀 ~ AccountPage ~ data:", data);

  const [activeSection, setActiveSection] = useState("profile");

  if (isLoading) {
    return <p>Cargando...</p>;
  }

  return (
    <div className="container mx-auto py-10">
      <div>
        <Link href="/" className="pb-4">
          <Button variant="ghost" className="flex space-x-4 items-center ">
            <ArrowLeft className="size-4" />
            Regresar
          </Button>
        </Link>
      </div>
      <h1 className="text-3xl font-bold mb-6">Mi Cuenta</h1>
      <div className="flex flex-col md:flex-row gap-6">
        <aside className="w-full md:w-64">
          <nav className="space-y-2">
            <Button
              variant={activeSection === "profile" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveSection("profile")}
            >
              <User className="mr-2 h-4 w-4" />
              Profile
            </Button>
            <Button
              variant={activeSection === "password" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveSection("password")}
            >
              <Lock className="mr-2 h-4 w-4" />
              Password
            </Button>
            <Button
              variant={activeSection === "purchases" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveSection("purchases")}
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              Purchase History
            </Button>
          </nav>
        </aside>
        <main className="flex-1">
          {activeSection === "profile" && (
            <div className="container mx-auto max-w-xl">
              <ProfileForm
                user={{
                  id: id,
                  name: data?.name || "",
                  lastname: data?.lastname || "",
                  email: data?.email || "",
                }}
              />
            </div>
          )}
          {activeSection === "password" && <PasswordResetForm id={id} />}
          {activeSection === "purchases" && <PurchaseHistory id={id} />}
        </main>
      </div>
    </div>
  );
};

export default AccountPage;
