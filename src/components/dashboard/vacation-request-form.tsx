"use client"

import React from "react"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { CheckCircle, AlertTriangle, Calendar, Info } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { vacationRequestSchema, type VacationRequestFormData } from "@/lib/validations"
import {
  isValidVacationDate,
  calculateVacationEnd,
  canRequestVacation,
  submitVacationRequestToAPI,
  getBrazilianDate,
} from "@/lib/vacation"

interface VacationRequestFormProps {
  onSuccess: () => void
}

export function VacationRequestForm({ onSuccess }: VacationRequestFormProps) {
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [dateError, setDateError] = useState("")
  const { user } = useAuth()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<VacationRequestFormData>({
    resolver: zodResolver(vacationRequestSchema),
  })

  const watchedStartDate = watch("dataInicio")
  const endDate = watchedStartDate ? calculateVacationEnd(watchedStartDate) : ""

  // Validate date in real-time
  React.useEffect(() => {
    if (watchedStartDate) {
      const validation = isValidVacationDate(watchedStartDate)
      setDateError(validation.valid ? "" : validation.message || "")
    } else {
      setDateError("")
    }
  }, [watchedStartDate])

  const onSubmit = async (data: VacationRequestFormData) => {
    if (!user) return

    setError("")
    setSuccess(false)

    try {
      // Validate if user can request vacation
      const canRequest = canRequestVacation(user.matricula)
      if (!canRequest.can) {
        setError(canRequest.message || "Não é possível solicitar férias no momento")
        return
      }

      // Validate vacation date
      const dateValidation = isValidVacationDate(data.dataInicio)
      if (!dateValidation.valid) {
        setError(dateValidation.message || "Data inválida")
        return
      }


      await submitVacationRequestToAPI({
        funcionarioMatricula: user.matricula,
        dataInicio: data.dataInicio,
        dataFim: calculateVacationEnd(data.dataInicio),
        observacoes: data.observacoes,
      })

      setSuccess(true)
      reset()
      setTimeout(() => {
        setSuccess(false)
        onSuccess()
      }, 3000)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Erro ao solicitar férias. Tente novamente.")
    }
  }

  // Check if user can request vacation
  const canRequest = user ? canRequestVacation(user.matricula) : { can: false }

  if (success) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <CheckCircle className="mx-auto h-12 w-12 text-primary" />
            <h3 className="text-lg font-semibold text-primary">Solicitação enviada com sucesso!</h3>
            <p className="text-muted-foreground">Sua solicitação de férias foi enviada para aprovação.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!canRequest.can) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Solicitar Férias
          </CardTitle>
          <CardDescription>Você não pode solicitar férias no momento</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{canRequest.message}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  const today = getBrazilianDate()
  const minDate = new Date(today)
  minDate.setDate(today.getDate() + 1)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Solicitar Férias
        </CardTitle>
        <CardDescription>
          Preencha os dados para solicitar suas férias. Lembre-se: as férias têm duração de 30 dias e não podem começar
          em finais de semana.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="dataInicio">Data de Início</Label>
              <Input
                id="dataInicio"
                type="date"
                {...register("dataInicio")}
                className="cursor-pointer"
                min={minDate.toISOString().split("T")[0]}
              />
              {errors.dataInicio && <p className="text-sm text-destructive">{errors.dataInicio.message}</p>}
              {dateError && <p className="text-sm text-destructive">{dateError}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dataFim">Data de Fim (Automática)</Label>
              <Input
                id="dataFim"
                type="date"
                value={endDate}
                disabled
                className="bg-muted cursor-not-allowed"
                placeholder="Será calculada automaticamente"
              />
              <p className="text-xs text-muted-foreground">30 dias a partir da data de início</p>
            </div>
          </div>

          {watchedStartDate && !dateError && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Suas férias serão de {new Date(watchedStartDate).toLocaleDateString("pt-BR")} até{" "}
                {new Date(endDate).toLocaleDateString("pt-BR")} (30 dias)
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações (Opcional)</Label>
            <Textarea
              id="observacoes"
              placeholder="Adicione observações sobre sua solicitação de férias..."
              {...register("observacoes")}
              className="cursor-pointer resize-none"
              rows={3}
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full cursor-pointer"
            disabled={isSubmitting || !!dateError || !watchedStartDate}
          >
            {isSubmitting ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Enviando solicitação...
              </>
            ) : (
              "Solicitar Férias"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
