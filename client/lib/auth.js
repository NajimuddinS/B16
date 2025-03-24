"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("user")
    const token = localStorage.getItem("token")

    if (storedUser && token) {
      setUser(JSON.parse(storedUser))
    }

    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      const response = await fetch("https://b16.onrender.com/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Login failed")
      }

      // Store token in localStorage
      localStorage.setItem("token", data.token)

      // Store user data
      localStorage.setItem("user", JSON.stringify(data.user))

      setUser(data.user)

      return data
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
    router.push("/login")
  }

  const getProfile = async () => {
    try {
      const token = localStorage.getItem("token")

      if (!token) {
        throw new Error("No authentication token found")
      }

      const response = await fetch("https://b16.onrender.com/api/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch profile")
      }

      // Update stored user data
      localStorage.setItem("user", JSON.stringify(data))
      setUser(data)

      return data
    } catch (error) {
      throw error
    }
  }

  return <AuthContext.Provider value={{ user, login, logout, getProfile, loading }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)

