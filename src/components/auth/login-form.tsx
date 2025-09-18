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
import { Loader2, TriangleAlert } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { loginSchema, type LoginFormData } from "@/lib/validations"

export function LoginForm() {
  const [error, setError] = useState("")
  const { login, isLoading } = useAuth()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setError("")
    const success = await login(data.matricula, data.senha)

    if (success) {
      router.push("/dashboard")
    } else {
      setError("Matrícula ou senha incorretos")
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-primary">Sistema de Férias</CardTitle>
        <CardDescription>Entre com sua matrícula e senha para acessar o sistema</CardDescription>
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
            <Label htmlFor="senha">Senha</Label>
            <Input
              id="senha"
              type="password"
              placeholder="Digite sua senha"
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

          <Button type="submit" className="w-full cursor-pointer" disabled={isSubmitting || isLoading}>
            {isSubmitting || isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Entrando...
              </>
            ) : (
              "Entrar"
            )}
          </Button>

          <div className="text-center">
            <Button type="button" variant="link" className="cursor-pointer" onClick={() => router.push("/register")}>
              Não tem conta? Cadastre-se
            </Button>
          </div>
        </form>
        {/* <Alert>
          <AlertDescription className="flex flex-col gap-4 items-center justify-center">
            <div className="flex w-full items-center justify-center gap-2">
              <TriangleAlert className="w-5 h-5 text-yellow-500" />
              <strong>Usuários de teste:</strong>
            </div>
            <div className="flex mt-1 text-xs grid grid-cols-2 gap-20">
              <div>
                <p><b>Matrícula:</b> 12345</p>
                <p><b>Nome:</b> João Silva</p>
                <p><b>Função:</b> funcionário</p>
                <p><b>Senha:</b> 123456</p>
              </div>
              <div>
                <p><b>Matrícula:</b> 67890</p>
                <p><b>Nome:</b> Maria Santos</p>
                <p><b>Função:</b> gestor</p>
                <p><b>Senha:</b> 123456</p>
              </div>
            </div>
          </AlertDescription>
        </Alert> */}
      </CardContent>
    </Card>
  )
}
