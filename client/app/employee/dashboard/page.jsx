"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth"
import DashboardSidebar from "@/components/dashboard-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, User } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function EmployeeDashboard() {
  const { user, loading } = useAuth()
  const [leaveRequests, setLeaveRequests] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchLeaveRequests = async () => {
      if (!user) return

      try {
        const token = localStorage.getItem("token")
        const response = await fetch("https://b16.onrender.com/api/employees/leave", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch leave requests")
        }

        setLeaveRequests(data)
      } catch (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      fetchLeaveRequests()
    }
  }, [user, toast])

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <DashboardSidebar />

      <div className="flex-1 lg:ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Welcome, {user?.name}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Here's what's happening with your account today.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Leave Days</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading
                  ? "Loading..."
                  : leaveRequests
                      .filter((req) => req.status === "approved")
                      .reduce((total, req) => {
                        const start = new Date(req.startDate)
                        const end = new Date(req.endDate)
                        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1
                        return total + days
                      }, 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Approved leave days this year</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? "Loading..." : leaveRequests.filter((req) => req.status === "pending").length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Awaiting approval</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profile Completion</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">100%</div>
              <p className="text-xs text-muted-foreground mt-1">Your profile is complete</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Leave Requests</CardTitle>
            <CardDescription>Your most recent leave requests and their status</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-4">Loading...</div>
            ) : leaveRequests.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">No leave requests found</div>
            ) : (
              <div className="space-y-4">
                {leaveRequests.slice(0, 5).map((leave) => (
                  <div key={leave._id} className="flex items-center justify-between border-b pb-4">
                    <div>
                      <p className="font-medium">{leave.reason}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(leave.startDate).toLocaleDateString()} -{" "}
                        {new Date(leave.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          leave.status === "approved"
                            ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                            : leave.status === "rejected"
                              ? "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
                        }`}
                      >
                        {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

