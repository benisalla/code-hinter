"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpen, FilePlus, Users, Home, LogOut, Settings, User, Moon, Sun, type LucideIcon } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuBadge,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "@/app/providers"
import { signOutAction } from "@/app/actions"
import { Skeleton } from "@/components/ui/skeleton"

interface NavItem {
  title: string
  href: string
  icon: LucideIcon
  badge?: number | string
  exactMatch?: boolean
}

interface NavGroup {
  title: string
  items: NavItem[]
}

interface SidebarNavProps {
  role: "student" | "teacher"
  profileData?: {
    full_name: string | null
    role: string
  } | null
  isLoading?: boolean
}

export function SidebarNav({ role, profileData, isLoading = false }: SidebarNavProps) {
  const pathname = usePathname()
  const { setTheme } = useTheme()
  const { state } = useSidebar()

  // Define navigation items based on role
  const navGroups: NavGroup[] =
    role === "student"
      ? [
          {
            title: "Overview",
            items: [
              {
                title: "Dashboard",
                href: "/dashboard/student",
                icon: Home,
                exactMatch: true,
              },
              {
                title: "Exercises",
                href: "/dashboard/student/exercises",
                icon: BookOpen,
                exactMatch: false,
              },
            ],
          },
        ]
      : [
          {
            title: "Overview",
            items: [
              {
                title: "Dashboard",
                href: "/dashboard/teacher",
                icon: Home,
                exactMatch: true,
              },
            ],
          },
          {
            title: "Content",
            items: [
              {
                title: "Exercises",
                href: "/dashboard/teacher/exercises",
                icon: BookOpen,
                exactMatch: false,
              },
              {
                title: "New Exercise",
                href: "/dashboard/teacher/exercises/new",
                icon: FilePlus,
                exactMatch: true,
              },
            ],
          },
          {
            title: "Management",
            items: [
              {
                title: "Students",
                href: "/dashboard/teacher/students",
                icon: Users,
                exactMatch: true,
              },
              
            ],
          },
        ]

  // Function to determine if a link is active
  const isLinkActive = (href: string, exactMatch = false) => {
    // Exact match
    if (pathname === href) return true

    // For non-exact matches, check if it's a parent route
    if (!exactMatch && pathname.startsWith(href + "/")) {
      // Check if this is a direct parent route
      // For example, /dashboard/student/exercises should be active for /dashboard/student/exercises/1
      // But /dashboard/student should not be active for /dashboard/student/exercises

      // Get the next segment after the href
      const remainingPath = pathname.slice(href.length + 1)

      // If there's only one segment left (e.g., "1" in /dashboard/student/exercises/1)
      // then this is a direct parent
      return !remainingPath.includes("/")
    }

    return false
  }

  // Get the user's name or use a fallback
  const userName = profileData?.full_name || (role === "student" ? "Student" : "Teacher")

  return (
    <Sidebar>
      <SidebarHeader className="flex h-14 items-center justify-center border-b px-6">
        <div className="flex items-center gap-2 font-semibold">
          <BookOpen className="h-6 w-6 text-primary" />
          <span className="text-lg">CodeHinter</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {navGroups.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={isLinkActive(item.href, item.exactMatch)} tooltip={item.title}>
                      <Link href={item.href}>
                        <item.icon className="h-5 w-5" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                    {item.badge && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter className="border-t p-0">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 rounded-full p-0">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                    <AvatarFallback>{role === "student" ? "S" : "T"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <form action={signOutAction}>
                    <button className="flex w-full items-center">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </button>
                  </form>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {state === "expanded" && (
              <div className="flex flex-col">
                {isLoading ? (
                  <>
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-3 w-16" />
                  </>
                ) : (
                  <>
                    <span className="text-sm font-medium">{userName}</span>
                    <span className="text-xs text-muted-foreground">{role}</span>
                  </>
                )}
              </div>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                <Sun className="mr-2 h-4 w-4" />
                <span>Light</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                <Moon className="mr-2 h-4 w-4" />
                <span>Dark</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                <Settings className="mr-2 h-4 w-4" />
                <span>System</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

