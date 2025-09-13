"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, CheckCircle, AlertCircle } from "lucide-react"
import type { VacationStats } from "@/types"

interface VacationStatsCardProps {
  stats: VacationStats
}

export function VacationStatsCard({ stats }: VacationStatsCardProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Dias</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-700">{stats.totalDias}</div>
          <p className="text-xs text-muted-foreground">Dias de férias por ano</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Dias Usados</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">{stats.diasUsados}</div>
          <p className="text-xs text-muted-foreground">Dias já utilizados</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Dias Restantes</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-slate-800">{stats.diasRestantes}</div>
          <p className="text-xs text-muted-foreground">Dias disponíveis</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Status</CardTitle>
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Badge variant={stats.podesolicitarFerias ? "default" : "secondary"} className="text-xs">
              {stats.podesolicitarFerias ? "Pode Solicitar" : "Não Disponível"}
            </Badge>
            {stats.proximasFerias && <p className="text-xs text-muted-foreground">Próximas: {stats.proximasFerias}</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
