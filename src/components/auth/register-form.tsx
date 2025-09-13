"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, CheckCircle } from "lucide-react"
import { registerUser } from "@/lib/auth"
import { registerSchema, type RegisterFormData } from "@/lib/validations"

export function RegisterForm() {
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    setError("")
    setSuccess(false)

    const success = await registerUser(data)

    if (success) {
      setSuccess(true)
      setTimeout(() => {
        router.push("/login")
      }, 2000)
    } else {
      setError("Matrícula já existe no sistema")
    }
  }

  if (success) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <CheckCircle className="mx-auto h-12 w-12 text-primary" />
            <h2 className="text-xl font-semibold text-primary">Cadastro realizado com sucesso!</h2>
            <p className="text-muted-foreground">Redirecionando para o login...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-primary">Cadastro de Funcionário</CardTitle>
        <CardDescription>Preencha os dados para criar sua conta no sistema</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="matricula">Matrícula</Label>
            <Input
              id="matricula"
              type="text"
              placeholder="Digite sua matrícula"
              {...register("matricula")}
              className="cursor-pointer"
            />
            {errors.matricula && <p className="text-sm text-destructive">{errors.matricula.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="nome">Nome Completo</Label>
            <Input
              id="nome"
              type="text"
              placeholder="Digite seu nome completo"
              {...register("nome")}
              className="cursor-pointer"
            />
            {errors.nome && <p className="text-sm text-destructive">{errors.nome.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="funcao">Função</Label>
            <Select onValueChange={(value) => setValue("funcao", value as "funcionario" | "gestor")}>
              <SelectTrigger className="cursor-pointer">
                <SelectValue placeholder="Selecione sua função" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="funcionario" className="cursor-pointer">
                  Funcionário
                </SelectItem>
                <SelectItem value="gestor" className="cursor-pointer">
                  Gestor
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.funcao && <p className="text-sm text-destructive">{errors.funcao.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="senha">Senha</Label>
            <Input
              id="senha"
              type="password"
              placeholder="Digite sua senha (mín. 6 caracteres)"
              {...register("senha")}
              className="cursor-pointer"
            />
            {errors.senha && <p className="text-sm text-destructive">{errors.senha.message}</p>}
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full cursor-pointer" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Cadastrando...
              </>
            ) : (
              "Cadastrar"
            )}
          </Button>

          <div className="text-center">
            <Button type="button" variant="link" className="cursor-pointer" onClick={() => router.push("/login")}>
              Já tem conta? Faça login
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
