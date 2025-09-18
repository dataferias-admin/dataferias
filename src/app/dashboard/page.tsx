"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AuthProvider } from "@/contexts/auth-context"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { DashboardHeader } from "@/components/dashboard/header"
import { VacationStatsCard } from "@/components/dashboard/vacation-stats-card"
import { VacationRequestForm } from "@/components/dashboard/vacation-request-form"
import { VacationRequestsList } from "@/components/dashboard/vacation-requests-list"
import { useAuth } from "@/contexts/auth-context"
import { fetchVacationRequestsFromAPI, calculateStatsFromRequests } from "@/lib/vacation"
import type { VacationRequest, VacationStats } from "@/types"

function DashboardContent() {
  const { user } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<VacationStats | null>(null)
  const [requests, setRequests] = useState<VacationRequest[]>([])
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    if (user) {
      // Redirect managers to their specific dashboard
      if (user.funcao === "gestor") {
        router.push("/manager")
        return
      }

      // Buscar solicitações reais da API
      fetchVacationRequestsFromAPI(user.matricula).then((apiRequests) => {
        setRequests(apiRequests.sort((a, b) => new Date(b.dataSolicitacao).getTime() - new Date(a.dataSolicitacao).getTime()));
        setStats(calculateStatsFromRequests(apiRequests));
      });
    }
  }, [user, refreshKey, router]);

  const handleRequestSuccess = () => {
    setRefreshKey((prev) => prev + 1)
  }

  // Show loading while redirecting managers
  if (user?.funcao === "gestor") {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Redirecionando para dashboard do gestor...</p>
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Carregando dados...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-6 py-8 space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Dashboard do Funcionário</h2>
          <p className="text-muted-foreground">Gerencie suas férias e acompanhe suas solicitações</p>
        </div>

        <VacationStatsCard stats={stats} />

        <div className="grid gap-8 lg:grid-cols-2">
          <VacationRequestForm onSuccess={handleRequestSuccess} />
          <VacationRequestsList requests={requests} />
        </div>
      </main>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <DashboardContent />
      </ProtectedRoute>
    </AuthProvider>
  )
}
