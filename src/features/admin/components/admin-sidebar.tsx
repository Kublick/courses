"use client";

import { BookOpen, Users, Video } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { usePathname } from "next/navigation";

export default function AdminSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { id: "courses", icon: BookOpen, label: "Cursos", href: "/admin/cursos" },
    { id: "users", icon: Users, label: "Clientes", href: "/admin/clientes" },
    {
      id: "lectures",
      icon: Video,
      label: "Lecciones",
      href: "/admin/lecciones",
    },
  ];

  return (
    <div>
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.href}
                    >
                      <a href={item.href}>
                        <item.icon />
                        <span>{item.label}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      {/* <SidebarProvider>
        <div className="flex h-screen ">
          <Sidebar className="min-w-24 ">
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
          <div className=" bg-purple-200 ">
            <header className="bg-white border-b p-4 flex items-center sticky top-0 z-10">
              <SidebarTrigger>
                <Menu className="w-6 h-6" />
              </SidebarTrigger>
              <h2 className="text-2xl font-bold ml-4">
                {menuItems.find((item) => item.id === activeSection)?.label}
              </h2>
            </header>
            <main className="p-6 w-full">
              {activeSection === "courses" && <CourseManagement />}
              {activeSection === "users" && <UserManagement />}
              {activeSection === "lectures" && <LectureUpload />}
            </main>
          </div>
        </div>
      </SidebarProvider> */}
    </div>
  );
}
