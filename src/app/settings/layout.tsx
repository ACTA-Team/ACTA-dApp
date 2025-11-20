import type { Metadata } from "next";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/layouts/sidebar/Sidebar";
import { HeaderHome } from "@/layouts/header/Header";

export const metadata: Metadata = {
  title: "Settings",
};

export default function SettingsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <HeaderHome />
        <div className="p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}