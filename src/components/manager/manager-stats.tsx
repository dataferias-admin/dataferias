"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Clock, CheckCircle, XCircle } from "lucide-react"
import type { VacationRequest } from "@/types"

interface ManagerStatsProps {
  requests: VacationRequest[]
}

export function ManagerStats({ requests }: ManagerStatsProps) {
  const totalRequests = requests.length
  const pendingRequests = requests.filter((req) => req.status === "pendente").length
  const approvedRequests = requests.filter((req) => req.status === "aprovado").length
  const rejectedRequests = requests.filter((req) => req.status === "rejeitado").length

  const uniqueEmployees = new Set(requests.map((req) => req.funcionarioMatricula)).size

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Funcionários</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">{uniqueEmployees}</div>
          <p className="text-xs text-muted-foreground">Com solicitações de férias</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-accent">{pendingRequests}</div>
          <p className="text-xs text-muted-foreground">Aguardando aprovação</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Aprovadas</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">{approvedRequests}</div>
          <p className="text-xs text-muted-foreground">Férias aprovadas</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Rejeitadas</CardTitle>
          <XCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-destructive">{rejectedRequests}</div>
          <p className="text-xs text-muted-foreground">Solicitações rejeitadas</p>
        </CardContent>
      </Card>
    </div>
  )
}
