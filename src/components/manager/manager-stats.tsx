"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Clock, CheckCircle, XCircle } from "lucide-react"

export function ManagerStats() {
  const [totalEmployees, setTotalEmployees] = React.useState<number | null>(null)
  const [pending, setPending] = React.useState<number | null>(null)
  const [approved, setApproved] = React.useState<number | null>(null)
  const [rejected, setRejected] = React.useState<number | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    async function fetchStats() {
      setLoading(true)
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL
        const token = localStorage.getItem("vacation-token")
        const headers = { Authorization: `Bearer ${token}` }
        const [emp, pend, apr, rej] = await Promise.all([
          fetch(`${API_URL}/info/funcionarios/count`, { headers }).then(r => r.json()),
          fetch(`${API_URL}/info/solicitacoes/pendentes`, { headers }).then(r => r.json()),
          fetch(`${API_URL}/info/solicitacoes/aprovadas`, { headers }).then(r => r.json()),
          fetch(`${API_URL}/info/solicitacoes/rejeitadas`, { headers }).then(r => r.json()),
        ])
        setTotalEmployees(typeof emp === 'number' ? emp : emp?.count ?? 0)
        setPending(typeof pend === 'number' ? pend : pend?.count ?? 0)
        setApproved(typeof apr === 'number' ? apr : apr?.count ?? 0)
        setRejected(typeof rej === 'number' ? rej : rej?.count ?? 0)
      } catch {
        setTotalEmployees(0)
        setPending(0)
        setApproved(0)
        setRejected(0)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Funcionários</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-500">{loading ? "..." : totalEmployees}</div>
          <p className="text-xs text-muted-foreground">Total cadastrado na base</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl text-yellow-500 font-bold text-accent">{loading ? "..." : pending}</div>
          <p className="text-xs text-muted-foreground">Aguardando avaliação</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Aprovadas</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-500">{loading ? "..." : approved}</div>
          <p className="text-xs text-muted-foreground">Férias aprovadas</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Rejeitadas</CardTitle>
          <XCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-destructive">{loading ? "..." : rejected}</div>
          <p className="text-xs text-muted-foreground">Solicitações rejeitadas</p>
        </CardContent>
      </Card>
    </div>
  )
}
