"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { LoginForm } from "@/components/auth/login-form"
import { AuthProvider, useAuth } from "@/contexts/auth-context"

function LoginPageContent() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push("/dashboard")
    }
  }, [user, router])

  if (user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Redirecionando...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <LoginForm />
    </div>
  )
}

export default function LoginPage() {
  return (
    <AuthProvider>
      <LoginPageContent />
    </AuthProvider>
  )
}
