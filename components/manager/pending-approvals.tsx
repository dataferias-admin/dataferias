"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, Clock, User, CheckCircle, XCircle, Loader2, AlertTriangle } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { approveVacationRequest, rejectVacationRequest } from "@/lib/vacation"
import type { VacationRequest } from "@/types"

interface PendingApprovalsProps {
  requests: VacationRequest[]
  onUpdate: () => void
}

export function PendingApprovals({ requests, onUpdate }: PendingApprovalsProps) {
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [rejectingId, setRejectingId] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState("")
  const [error, setError] = useState("")
  const { user } = useAuth()

  const pendingRequests = requests.filter((req) => req.status === "pendente")

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR")
  }

  const handleApprove = async (requestId: string) => {
    if (!user) return

    setProcessingId(requestId)
    setError("")

    try {
      const success = await approveVacationRequest(requestId, user.nome)
      if (success) {
        onUpdate()
      } else {
        setError("Erro ao aprovar solicitação")
      }
    } catch (error) {
      setError("Erro ao aprovar solicitação")
    } finally {
      setProcessingId(null)
    }
  }

  const handleReject = async (requestId: string) => {
    if (!user) return

    setProcessingId(requestId)
    setError("")

    try {
      const success = await rejectVacationRequest(requestId, user.nome, rejectReason)
      if (success) {
        setRejectingId(null)
        setRejectReason("")
        onUpdate()
      } else {
        setError("Erro ao rejeitar solicitação")
      }
    } catch (error) {
      setError("Erro ao rejeitar solicitação")
    } finally {
      setProcessingId(null)
    }
  }

  if (pendingRequests.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Aprovações Pendentes
          </CardTitle>
          <CardDescription>Solicitações de férias aguardando sua aprovação</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <CheckCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Nenhuma solicitação pendente</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Aprovações Pendentes
          <Badge variant="secondary" className="ml-2">
            {pendingRequests.length}
          </Badge>
        </CardTitle>
        <CardDescription>Solicitações de férias aguardando sua aprovação</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {pendingRequests.map((request) => (
            <div key={request.id} className="border border-border rounded-lg p-4 space-y-4">
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
                <Badge variant="secondary">Pendente</Badge>
              </div>

              <div className="text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="h-3 w-3" />
                  <span>Solicitado em: {formatDate(request.dataSolicitacao)}</span>
                </div>
              </div>

              {request.observacoes && (
                <div className="p-3 bg-muted rounded text-sm">
                  <strong>Observações do funcionário:</strong>
                  <p className="mt-1">{request.observacoes}</p>
                </div>
              )}

              {rejectingId === request.id ? (
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor={`reject-reason-${request.id}`}>Motivo da rejeição</Label>
                    <Textarea
                      id={`reject-reason-${request.id}`}
                      placeholder="Digite o motivo da rejeição..."
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      className="cursor-pointer resize-none"
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleReject(request.id)}
                      disabled={processingId === request.id || !rejectReason.trim()}
                      className="cursor-pointer"
                    >
                      {processingId === request.id ? (
                        <>
                          <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                          Rejeitando...
                        </>
                      ) : (
                        <>
                          <XCircle className="mr-2 h-3 w-3" />
                          Confirmar Rejeição
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setRejectingId(null)
                        setRejectReason("")
                      }}
                      disabled={processingId === request.id}
                      className="cursor-pointer"
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleApprove(request.id)}
                    disabled={processingId === request.id}
                    className="cursor-pointer"
                  >
                    {processingId === request.id ? (
                      <>
                        <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                        Aprovando...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-3 w-3" />
                        Aprovar
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setRejectingId(request.id)}
                    disabled={processingId === request.id}
                    className="cursor-pointer"
                  >
                    <XCircle className="mr-2 h-3 w-3" />
                    Rejeitar
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
