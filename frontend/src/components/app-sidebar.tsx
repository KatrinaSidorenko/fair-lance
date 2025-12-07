"use client";

import * as React from "react";
import {
  Briefcase,
  FileText,
  Home,
  Search,
  Settings,
  Users,
  Wallet,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth, getRoleDisplayName } from "@/lib/auth-context";
import Link from "next/link";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, userRole, isLoading } = useAuth();

  // Navigation items based on user role
  const getNavItems = () => {
    const baseItems = [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: Home,
        isActive: true,
      },
    ];

    if (userRole === "employer" || userRole === "admin") {
      baseItems.push(
        {
          title: "My Jobs",
          url: "/dashboard",
          icon: Briefcase,
          isActive: false,
        },
        {
          title: "Create Job",
          url: "/jobs/create",
          icon: FileText,
          isActive: false,
        }
      );
    }

    if (userRole === "freelancer" || userRole === "admin") {
      baseItems.push(
        {
          title: "Browse Jobs",
          url: "/jobs",
          icon: Search,
          isActive: false,
        },
        {
          title: "My Applications",
          url: "/dashboard",
          icon: FileText,
          isActive: false,
        }
      );
    }

    if (userRole === "admin") {
      baseItems.push({
        title: "All Users",
        url: "/dashboard/users",
        icon: Users,
        isActive: false,
      });
    }

    baseItems.push(
      {
        title: "Wallet",
        url: "#",
        icon: Wallet,
        isActive: false,
      },
      {
        title: "Settings",
        url: "/dashboard/me",
        icon: Settings,
        isActive: false,
      }
    );

    return baseItems;
  };

  const userData = user
    ? {
        name: user.username,
        email: user.email,
        avatar: "",
        role: getRoleDisplayName(user.role_id),
      }
    : {
        name: "Loading...",
        email: "",
        avatar: "",
        role: "",
      };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <span className="font-bold text-sm">FL</span>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">FairLance</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {userData.role || "Decentralized Work"}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={getNavItems()} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
