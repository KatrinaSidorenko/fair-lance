"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { api, UserResponse } from "@/lib/api"
import { isAuthenticated, logout } from "@/lib/auth"
import { Button } from "@/components/ui/button"

export default function MePage() {
  const router = useRouter()
  const [user, setUser] = useState<UserResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login")
      return
    }

    const fetchUser = async () => {
      try {
        const data = await api.getMe()
        setUser(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch user")
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [router])

  const getRoleName = (roleId: number) => {
    switch (roleId) {
      case 1:
        return "Employer"
      case 2:
        return "Freelancer"
      case 3:
        return "Admin"
      default:
        return "Unknown"
    }
  }

  const handleLogout = () => {
    logout()
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>My Profile</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="rounded-lg border bg-card">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">My Profile</h2>
              {loading && (
                <div className="text-center py-8">Loading profile...</div>
              )}
              {error && (
                <div className="p-4 text-sm text-red-600 bg-red-50 rounded-md mb-4">
                  {error}
                </div>
              )}
              {!loading && !error && user && (
                <div className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">
                        User ID
                      </label>
                      <p className="text-lg">{user.id}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">
                        Username
                      </label>
                      <p className="text-lg">{user.username}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">
                        Email
                      </label>
                      <p className="text-lg">{user.email}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">
                        Account Type
                      </label>
                      <div>
                        <span className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800">
                          {getRoleName(user.role_id)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex gap-4">
                    <Button variant="outline" onClick={handleLogout}>
                      Logout
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
