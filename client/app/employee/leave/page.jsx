"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth"
import DashboardSidebar from "@/components/dashboard-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Calendar, Clock } from "lucide-react"

export default function EmployeeLeave() {
  const { user, loading } = useAuth()
  const [leaveRequests, setLeaveRequests] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    reason: "",
  })
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

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const token = localStorage.getItem("token")
      const response = await fetch("https://b16.onrender.com/api/employees/leave", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit leave request")
      }

      toast({
        title: "Success",
        description: "Leave request submitted successfully",
      })

      // Reset form and refresh leave requests
      setFormData({
        startDate: "",
        endDate: "",
        reason: "",
      })
      setShowForm(false)

      // Add the new leave request to the list
      setLeaveRequests((prev) => [data, ...prev])
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <DashboardSidebar />

      <div className="flex-1 lg:ml-64 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Leave Requests</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your leave requests</p>
          </div>

          <Button onClick={() => setShowForm(!showForm)}>{showForm ? "Cancel" : "Request Leave"}</Button>
        </div>

        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>New Leave Request</CardTitle>
              <CardDescription>Fill in the details to submit a new leave request</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      name="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      name="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">Reason for Leave</Label>
                  <Textarea
                    id="reason"
                    name="reason"
                    placeholder="Please provide a reason for your leave request"
                    value={formData.reason}
                    onChange={handleChange}
                    required
                  />
                </div>

                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Request"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Your Leave Requests</CardTitle>
            <CardDescription>View and track the status of your leave requests</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-4">Loading...</div>
            ) : leaveRequests.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">No leave requests found</div>
            ) : (
              <div className="space-y-4">
                {leaveRequests.map((leave) => (
                  <div key={leave._id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{leave.reason}</h3>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(leave.startDate).toLocaleDateString()} -{" "}
                          {new Date(leave.endDate).toLocaleDateString()}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <Clock className="h-4 w-4 mr-1" />
                          Requested on {new Date(leave.createdAt).toLocaleDateString()}
                        </div>
                      </div>

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

                    {leave.comment && (
                      <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded text-sm">
                        <p className="font-medium">HR Comment:</p>
                        <p>{leave.comment}</p>
                      </div>
                    )}
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

