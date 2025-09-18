"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User } from "lucide-react"
import type { VacationRequest } from "@/types"

interface VacationRequestsListProps {
  requests: VacationRequest[]
}

export function VacationRequestsList({ requests }: VacationRequestsListProps) {
  const getStatusColor = (status: VacationRequest["status"]) => {
    switch (status) {
      case "aprovado":
        return "outline"
      case "rejeitado":
        return "destructive"
      case "pendente":
        return "secondary"
      default:
        return "secondary"
    }
  }

  const getStatusText = (status: VacationRequest["status"]) => {
    switch (status) {
      case "aprovado":
        return "Aprovado"
      case "rejeitado":
        return "Rejeitado"
      case "pendente":
        return "Pendente"
      default:
        return "Desconhecido"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR")
  }

  if (requests.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Minhas Solicitações
          </CardTitle>
          <CardDescription>Histórico das suas solicitações de férias</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Nenhuma solicitação de férias encontrada</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Minhas Solicitações
        </CardTitle>
        <CardDescription>Histórico das suas solicitações de férias</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {requests.map((request) => (
            <div key={request.id} className="border border-border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">
                    {formatDate(request.dataInicio)} - {formatDate(request.dataFim)}
                  </span>
                </div>
                <Badge variant={getStatusColor(request.status)}>{getStatusText(request.status)}</Badge>
              </div>

              <div className="grid gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="h-3 w-3" />
                  <span>Solicitado em: {formatDate(request.dataSolicitacao)}</span>
                </div>

                {request.aprovadoPor && request.dataAprovacao && (
                  <div className="flex items-center gap-2">
                    <User className="h-3 w-3" />
                    <span>
                      {request.status === "aprovado" ? "Aprovado" : "Rejeitado"} por {request.aprovadoPor} em{" "}
                      {formatDate(request.dataAprovacao)}
                    </span>
                  </div>
                )}

                {request.observacoes && (
                  <div className="mt-2 p-2 bg-muted rounded text-sm">
                    <strong>Observações:</strong> {request.observacoes}
                  </div>
                )}

                {request.justificativaAvaliador && (
                  <div className="mt-2 p-2 bg-muted rounded text-sm">
                    <strong>Justificativa:</strong> {request.justificativaAvaliador}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
