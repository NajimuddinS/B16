"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { Users, Home, Calendar, User, LogOut, Menu, X, BarChart2, ClipboardList } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function DashboardSidebar() {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Define navigation items based on user role
  const getNavItems = () => {
    const baseItems = [
      {
        name: "Dashboard",
        href: `/${user?.role}/dashboard`,
        icon: Home,
      },
      {
        name: "Profile",
        href: `/${user?.role}/profile`,
        icon: User,
      },
    ]

    if (user?.role === "employee") {
      return [
        ...baseItems,
        {
          name: "Leave Requests",
          href: "/employee/leave",
          icon: Calendar,
        },
      ]
    } else if (user?.role === "hr") {
      return [
        ...baseItems,
        {
          name: "Employees",
          href: "/hr/employees",
          icon: Users,
        },
        {
          name: "Leave Requests",
          href: "/hr/leaves",
          icon: Calendar,
        },
      ]
    } else if (user?.role === "employer") {
      return [
        ...baseItems,
        {
          name: "Employees",
          href: "/employer/employees",
          icon: Users,
        },
        {
          name: "HR Staff",
          href: "/employer/hrs",
          icon: ClipboardList,
        },
        {
          name: "Reports",
          href: "/employer/reports",
          icon: BarChart2,
        },
      ]
    }

    return baseItems
  }

  const navItems = getNavItems()

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button variant="outline" size="icon" onClick={toggleMobileMenu} className="bg-white">
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/*  />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </div>
      
      {/* Mobile sidebar */}
      <div
        className={cn(
          "fixed inset-0 z-40 lg:hidden bg-black/50 transition-opacity duration-200",
          isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
      >
        <div
          className={cn(
            "fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 transform transition-transform duration-200 ease-in-out",
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex items-center justify-center h-16 border-b">
            <Users className="h-8 w-8 text-primary" />
            <span className="ml-2 text-xl font-bold">EmpManage</span>
          </div>

          <nav className="mt-5 px-2 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center px-2 py-2 text-base font-medium rounded-md",
                  pathname === item.href
                    ? "bg-primary text-white"
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700",
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <item.icon
                  className={cn(
                    "mr-3 h-6 w-6",
                    pathname === item.href
                      ? "text-white"
                      : "text-gray-400 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-300",
                  )}
                />
                {item.name}
              </Link>
            ))}

            <button
              onClick={logout}
              className="w-full group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <LogOut className="mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-300" />
              Logout
            </button>
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:border-r lg:border-gray-200 lg:bg-white lg:dark:bg-gray-800 lg:dark:border-gray-700">
        <div className="flex items-center justify-center h-16 border-b">
          <Users className="h-8 w-8 text-primary" />
          <span className="ml-2 text-xl font-bold">EmpManage</span>
        </div>

        <div className="flex-1 flex flex-col overflow-y-auto">
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
                  pathname === item.href
                    ? "bg-primary text-white"
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700",
                )}
              >
                <item.icon
                  className={cn(
                    "mr-3 h-5 w-5",
                    pathname === item.href
                      ? "text-white"
                      : "text-gray-400 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-300",
                  )}
                />
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={logout}
              className="w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <LogOut className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-300" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

