"use client";

import { useState } from "react";
import { BookOpen, Users, Video, Menu } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { CourseManagement } from "./course-management";
import { UserManagement } from "./user-management";
import { LectureUpload } from "./lecture-upload";

export default function AdminSidebar() {
  const [activeSection, setActiveSection] = useState("courses");

  const menuItems = [
    { id: "courses", icon: BookOpen, label: "Cursos" },
    { id: "users", icon: Users, label: "Users" },
    { id: "lectures", icon: Video, label: "Lectures" },
  ];

  return (
    <SidebarProvider>
      <div className="flex h-screen ">
        <Sidebar className="min-w-24">
          <SidebarHeader>
            <h1 className="text-xl font-bold p-4">Admin Panel</h1>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => setActiveSection(item.id)}
                    isActive={activeSection === item.id}
                  >
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <div className="flex-1 overflow-auto">
          <header className="bg-white border-b p-4 flex items-center sticky top-0 z-10">
            <SidebarTrigger>
              <Menu className="w-6 h-6" />
            </SidebarTrigger>
            <h2 className="text-2xl font-bold ml-4">
              {menuItems.find((item) => item.id === activeSection)?.label}
            </h2>
          </header>
          <main className="p-6">
            {activeSection === "courses" && <CourseManagement />}
            {activeSection === "users" && <UserManagement />}
            {activeSection === "lectures" && <LectureUpload />}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
