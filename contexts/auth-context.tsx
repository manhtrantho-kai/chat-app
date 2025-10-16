"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { apiClient } from "@/lib/api"
import type { User } from "@/lib/types"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (username: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string) => Promise<void>
  logout: () => void
  updateUser: (data: any) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const MOCK_ADMIN = {
  username: "admin",
  password: "admin123",
  user: {
    id: "mock-admin-id",
    username: "admin",
    email: "admin@example.com",
    avatar: "",
    status: "online" as const,
    createdAt: new Date().toISOString(),
  },
  token: "mock-admin-token-12345",
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      if (token === MOCK_ADMIN.token) {
        setUser(MOCK_ADMIN.user)
        setIsLoading(false)
        return
      }

      apiClient
        .getCurrentUser(token)
        .then((userData) => setUser(userData as User))
        .catch(() => {
          localStorage.removeItem("token")
        })
        .finally(() => setIsLoading(false))
    } else {
      setIsLoading(false)
    }
  }, [])

  const login = async (username: string, password: string) => {
    if (username === MOCK_ADMIN.username && password === MOCK_ADMIN.password) {
      localStorage.setItem("token", MOCK_ADMIN.token)
      setUser(MOCK_ADMIN.user)
      router.push("/chat")
      return
    }

    const response = await apiClient.login(username, password)
    localStorage.setItem("token", response.token)
    console.log("token", response.token)
    setUser(response.user)
    router.push("/chat")
  }

  const register = async (username: string, email: string, password: string) => {
    const response = await apiClient.register(username, email, password)
    localStorage.setItem("token", response.token)
    setUser(response.user)
    router.push("/chat")
  }

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
    router.push("/login")
  }

  const updateUser = async (data: any) => {
    if (!user) throw new Error("No user logged in")

    const updatedUser = await apiClient.updateUser(data)
    setUser(updatedUser as User)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
