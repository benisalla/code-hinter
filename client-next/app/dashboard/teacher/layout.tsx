import type React from "react"
import { SidebarNav } from "../_components/sidebar-nav"
import { SidebarInset } from "@/components/ui/sidebar"
import { UserProfileProvider } from "../_components/user-profile-provider"

export default function TeacherDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <UserProfileProvider role="teacher">
        <SidebarNav role="teacher" />
      </UserProfileProvider>
      <SidebarInset className="p-6 bg-background">
        <div className="ml-0 max-w-7xl">{children}</div>
      </SidebarInset>
    </>
  )
}

