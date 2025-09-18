"use client"

import { useState, useEffect } from "react"
import { AuthProvider } from "@/contexts/auth-context"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { DashboardHeader } from "@/components/dashboard/header"
import { ManagerStats } from "@/components/manager/manager-stats"
import { PendingApprovals } from "@/components/manager/pending-approvals"
import { AllRequestsHistory } from "@/components/manager/all-requests-history"
import { VacationRequestForm } from "@/components/dashboard/vacation-request-form"
import { fetchAllVacationRequestsFromAPI } from "@/lib/vacation"
import type { VacationRequest } from "@/types"

function ManagerDashboardContent() {
  const [requests, setRequests] = useState<VacationRequest[]>([])
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    // Load all vacation requests from API
    fetchAllVacationRequestsFromAPI().then((apiRequests) => {
      setRequests(apiRequests.sort((a, b) => new Date(b.dataSolicitacao).getTime() - new Date(a.dataSolicitacao).getTime()));
    });
  }, [refreshKey])

  const handleUpdate = () => {
    setRefreshKey((prev) => prev + 1)
  }

  const handleRequestSuccess = () => {
    setRefreshKey((prev) => prev + 1)
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-6 py-8 space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Dashboard do Gestor</h2>
          <p className="text-muted-foreground">Gerencie as solicitações de férias da equipe</p>
        </div>

        <ManagerStats  />

        <div className="grid gap-8 lg:grid-cols-2">
          <PendingApprovals />
          <VacationRequestForm onSuccess={handleRequestSuccess} />
        </div>

        <AllRequestsHistory requests={requests} />
      </main>
    </div>
  )
}

export default function ManagerPage() {
  return (
    <AuthProvider>
      <ProtectedRoute requiredRole="gestor">
        <ManagerDashboardContent />
      </ProtectedRoute>
    </AuthProvider>
  )
}
