import { z } from "zod"

export const loginSchema = z.object({
  matricula: z.string().min(1, "Matrícula é obrigatória"),
  senha: z.string().min(1, "Senha é obrigatória"),
})

export const registerSchema = z.object({
  matricula: z.string().min(1, "Matrícula é obrigatória"),
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  funcao: z.enum(["funcionario", "gestor"], {
    errorMap: () => ({ message: "Função deve ser funcionário ou gestor" }),
  }),
  senha: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
})

export const vacationRequestSchema = z.object({
  dataInicio: z.string().min(1, "Data de início é obrigatória"),
  observacoes: z.string().optional(),
})

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
export type VacationRequestFormData = z.infer<typeof vacationRequestSchema>
