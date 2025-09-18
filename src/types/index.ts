export type UserRole = "operacional" | "gestor"

export interface User {
  matricula: string
  nome: string
  funcao: UserRole
  senha?: string
}

export interface VacationRequest {
  id: string
  funcionarioMatricula: string
  funcionarioNome: string
  dataInicio: string
  dataFim: string
  status: "pendente" | "aprovado" | "rejeitado"
  dataSolicitacao: string
  observacoes?: string
  justificativaAvaliador?: string
  aprovadoPor?: string
  dataAprovacao?: string
}

export interface AuthContextType {
  user: User | null
  login: (matricula: string, senha: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

export interface VacationStats {
  totalDias: number
  diasUsados: number
  diasRestantes: number
  proximasFerias?: string
  podesolicitarFerias: boolean
}
