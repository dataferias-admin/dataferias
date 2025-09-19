"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, User, Search, Filter } from "lucide-react"
import type { VacationRequest } from "@/types"

interface AllRequestsHistoryProps {
  requests: VacationRequest[]
}

export function AllRequestsHistory({ requests }: AllRequestsHistoryProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 5

  const getStatusColor = (status: VacationRequest["status"]) => {
    switch (status) {
      case "aprovado":
        return "secondary"
      case "rejeitado":
        return "destructive"
      case "pendente":
        return "default"
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

  const filteredRequests = requests
    .filter((request) => {
      const matchesSearch =
        request.funcionarioNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.funcionarioMatricula.includes(searchTerm)
      const matchesStatus = statusFilter === "all" || request.status === statusFilter
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => new Date(b.dataSolicitacao).getTime() - new Date(a.dataSolicitacao).getTime())

  const totalPages = Math.ceil(filteredRequests.length / PAGE_SIZE)
  const paginatedRequests = filteredRequests.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  // Reset page to 1 if filters/search change
  React.useEffect(() => {
    setPage(1)
  }, [searchTerm, statusFilter, requests])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Histórico Completo
        </CardTitle>
        <CardDescription>Todas as solicitações de férias da empresa</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex gap-4 flex-col sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou matrícula..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 cursor-pointer"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 cursor-pointer">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="cursor-pointer">
                    Todos
                  </SelectItem>
                  <SelectItem value="pendente" className="cursor-pointer">
                    Pendente
                  </SelectItem>
                  <SelectItem value="aprovado" className="cursor-pointer">
                    Aprovado
                  </SelectItem>
                  <SelectItem value="rejeitado" className="cursor-pointer">
                    Rejeitado
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results */}
          {filteredRequests.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== "all"
                  ? "Nenhuma solicitação encontrada com os filtros aplicados"
                  : "Nenhuma solicitação de férias encontrada"}
              </p>
            </div>
          ) : (
            <>
            <div className="space-y-4">
              {paginatedRequests.map((request) => (
                <div key={request.id} className="border border-border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-foreground">{request.funcionarioNome}</span>
                        <Badge variant="outline">Mat: {request.funcionarioMatricula}</Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {formatDate(request.dataInicio)} - {formatDate(request.dataFim)}
                        </span>
                      </div>
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
                  </div>

                  {request.observacoes && (
                    <div className="p-3 bg-muted rounded text-sm">
                      <strong>Observações:</strong>
                      <p className="mt-1">{request.observacoes}</p>
                    </div>
                  )}

                  {request.justificativaAvaliador && (
                    <div className="p-3 bg-muted rounded text-sm">
                      <strong>Justificativa do avaliador:</strong>
                      <p className="mt-1">{request.justificativaAvaliador}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-6">
                <button
                  className="px-3 py-1 rounded bg-muted text-foreground disabled:opacity-50"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Anterior
                </button>
                <span className="text-sm">
                  Página {page} de {totalPages}
                </span>
                <button
                  className="px-3 py-1 rounded bg-muted text-foreground disabled:opacity-50"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Próxima
                </button>
              </div>
            )}
            </>
          )}
  </div>
      </CardContent>
    </Card>
  )
}
