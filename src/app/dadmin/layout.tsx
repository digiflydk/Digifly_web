
"use client";

import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarInset,
} from "@/components/ui/sidebar";
import {
  Home,
  Palette,
  Link2,
  Newspaper,
  Briefcase,
  Mail,
  Shield,
  Library,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

function MainSidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;
  const isSubActive = (path: string) => pathname.startsWith(path);

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive("/dadmin")}
              tooltip="Dashboard"
            >
              <Link href="/dadmin">
                <Home />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isSubActive("/dadmin/site")}
              tooltip="Site & SEO"
            >
              <Link href="/dadmin/site">
                <Palette />
                <span>Site & SEO</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isSubActive("/dadmin/navigation")}
              tooltip="Navigation"
            >
              <Link href="/dadmin/navigation">
                <Link2 />
                <span>Navigation</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
           <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isSubActive("/dadmin/home")}
              tooltip="Homepage"
            >
              <Link href="/dadmin/home">
                <Newspaper />
                <span>Homepage</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}

export default function DadminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body className="bg-background text-foreground font-sans">
        <SidebarProvider>
          <div className="flex">
            <MainSidebar />
            <SidebarInset>
              <main className="flex-1 w-full p-6">{children}</main>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}
