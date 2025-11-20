"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  IconHome,
  IconId,
  IconUpload,
  IconLock,
  IconShieldCheck,
  IconBook2,
  IconSettings,
} from "@tabler/icons-react";

export function AppSidebar() {
  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <div className="mt-2 flex items-center gap-2 px-2">
          <div className="size-8 rounded-mdtext-white grid place-items-center">
            <Image
              src="/black.png"
              alt="ACTA"
              width={32}
              height={32}
              className="dark:hidden"
            />
            <Image
              src="/logo.png"
              alt="ACTA"
              width={32}
              height={32}
              className="hidden dark:block"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">ACTA dApp</span>
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              The new infrastructure <br />
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard">
                    <IconHome />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard/credentials">
                    <IconId />
                    <span>Credentials</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard/issue">
                    <IconUpload />
                    <span>Issue</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard/vault">
                    <IconLock />
                    <span>Vault</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard/authorize">
                    <IconShieldCheck />
                    <span>Authorize</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Resources</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="https://docs.acta.build/">
                    <IconBook2 />
                    <span>Documentation</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/settings">
                    <IconSettings />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="size-8 rounded-full bg-neutral-700 grid place-items-center text-white text-sm">
            SH
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">shadcn</span>
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              m@example.com
            </span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
