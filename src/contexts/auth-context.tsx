"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { AuthContextType, User } from "@/types"
import { authenticateUser } from "@/lib/auth"

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("vacation-user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (matricula: string, senha: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      const authenticatedUser = await authenticateUser(matricula, senha)
      if (authenticatedUser) {
        setUser(authenticatedUser)
        localStorage.setItem("vacation-user", JSON.stringify(authenticatedUser))
        return true
      }
      return false
    } catch (error) {
      console.error("Login error:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("vacation-user")
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
