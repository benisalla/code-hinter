import type React from "react";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarRail,
} from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      {children}
      <SidebarRail />
      <SidebarTrigger className="fixed top-4 left-4 z-50 md:hidden" />
    </SidebarProvider>
  );
}
