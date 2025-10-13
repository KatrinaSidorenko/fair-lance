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
import { isAuthenticated } from "@/lib/auth"

export default function UsersPage() {
  const router = useRouter()
  const [users, setUsers] = useState<UserResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login")
      return
    }

    const fetchUsers = async () => {
      try {
        const data = await api.getAllUsers()
        setUsers(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch users")
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
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
                  <BreadcrumbPage>All Users</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="rounded-lg border bg-card">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">All Users</h2>
              {loading && (
                <div className="text-center py-8">Loading users...</div>
              )}
              {error && (
                <div className="p-4 text-sm text-red-600 bg-red-50 rounded-md mb-4">
                  {error}
                </div>
              )}
              {!loading && !error && users.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No users found
                </div>
              )}
              {!loading && !error && users.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-semibold">ID</th>
                        <th className="text-left p-3 font-semibold">Username</th>
                        <th className="text-left p-3 font-semibold">Email</th>
                        <th className="text-left p-3 font-semibold">Role</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-b hover:bg-muted/50">
                          <td className="p-3">{user.id}</td>
                          <td className="p-3">{user.username}</td>
                          <td className="p-3">{user.email}</td>
                          <td className="p-3">
                            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800">
                              {getRoleName(user.role_id)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
