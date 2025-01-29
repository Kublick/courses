"use client";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

interface Props {
  user: {
    name: string | null;
    email: string;
    lastname: string | null;
  };
}

export function Header({ user }: Props) {
  const { email, name, lastname } = user;

  const logoutUser = () => {
    fetch("/api/auth/logout", {
      method: "POST",
    });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center mx-auto">
        <div className="flex gap-4 items-center">
          <Image
            src="/incrementalogo.png"
            alt="Cursos Logo"
            width={128}
            height={128}
          />
        </div>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="flex items-center space-x-4">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src="https://github.com/shaddcn.png"
                    alt="User"
                  />
                  <AvatarFallback>
                    {name?.slice(0, 1).toUpperCase()}
                    {lastname?.slice(0, 1).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{name}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {email}
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href={"/cuenta"}>Mi cuenta</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logoutUser}>Salir</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
