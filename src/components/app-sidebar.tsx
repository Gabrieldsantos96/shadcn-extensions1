"use client";

import { Home, Puzzle, Type, MessageSquare } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/src/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

export function AppSidebar() {
  const pathname = usePathname();
  const tSidebar = useTranslations("sidebar");
  const tNavigation = useTranslations("navigation");

  const items = [
    {
      title: tNavigation("home"),
      url: `/`,
      icon: Home,
    },
    {
      title: tNavigation("combobox"),
      url: `/examples/combobox`,
      icon: Puzzle,
    },
    {
      title: tNavigation("inputs"),
      url: `/examples/inputs`,
      icon: Type,
    },
    {
      title: tNavigation("dialogs"),
      url: `/examples/dialogs`,
      icon: MessageSquare,
    },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1">
          <Puzzle className="h-6 w-6 text-primary" />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{tSidebar("components")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
