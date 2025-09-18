// Busca todas as solicitações da API (para gestor)
export async function fetchAllVacationRequestsFromAPI(): Promise<VacationRequest[]> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const token = localStorage.getItem("vacation-token");
  if (!token) return [];
  try {
    const res = await fetch(`${API_URL}/solicitacoes`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data as any[]).map((item) => ({
      id: item.uuid,
      funcionarioMatricula: item.solicitante?.matricula || "",
      funcionarioNome: item.solicitante?.nome || "",
      dataInicio: item.data_inicio,
      dataFim: item.data_fim,
      status: item.status,
      dataSolicitacao: item.data_solicitacao,
      observacoes: item.observacao_solicitante || undefined,
      aprovadoPor: item.avaliador?.nome || undefined,
      dataAprovacao: item.data_avaliacao || undefined,
      justificativaAvaliador: item.justificativa_avaliador || undefined,
    }));
  } catch (e) {
    console.error("Erro ao buscar todas as solicitações da API:", e);
    return [];
  }
}
// Busca solicitações reais da API para o funcionário
export async function fetchVacationRequestsFromAPI(matricula: string): Promise<VacationRequest[]> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL
  const token = localStorage.getItem("vacation-token");
  if (!token) return [];
  try {
    const res = await fetch(`${API_URL}/solicitacoes/funcionario/${matricula}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) return [];
    const data = await res.json();
    // Mapear para VacationRequest[]
    return (data as any[]).map((item) => ({
      id: item.uuid,
      funcionarioMatricula: item.solicitante?.matricula || "",
      funcionarioNome: item.solicitante?.nome || "",
      dataInicio: item.data_inicio,
      dataFim: item.data_fim,
      status: item.status,
      dataSolicitacao: item.data_solicitacao,
      observacoes: item.observacao_solicitante || undefined,
      justificativaAvaliador: item.justificativa_avaliador || undefined,
      aprovadoPor: item.avaliador?.nome || undefined,
      dataAprovacao: item.data_avaliacao || undefined,
    }));
  } catch (e) {
    console.error("Erro ao buscar solicitações da API:", e);
    return [];
  }
}

// Envia solicitação de férias para a API real
export async function submitVacationRequestToAPI({ funcionarioMatricula, dataInicio, dataFim, observacoes }: {
  funcionarioMatricula: string;
  dataInicio: string;
  dataFim: string;
  observacoes?: string;
}): Promise<boolean> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const token = localStorage.getItem("vacation-token");
  if (!token) throw new Error("Token de autenticação não encontrado.");
  try {
    const res = await fetch(`${API_URL}/solicitacoes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        solicitante: { matricula: funcionarioMatricula },
        data_inicio: dataInicio,
        data_fim: dataFim,
        observacao_solicitante: observacoes || undefined,
      }),
    });
    if (res.status === 201) return true;
    const err = await res.text();
    throw new Error(err || "Erro ao solicitar férias");
  } catch (e: any) {
    throw new Error(e?.message || "Erro ao solicitar férias");
  }
}

// Calcula stats a partir das solicitações reais
export function calculateStatsFromRequests(requests: VacationRequest[]): VacationStats {
  const totalDias = 30;
  // Considera "usou férias" se existe uma solicitação aprovada nos últimos 365 dias
  const hoje = new Date();
  let diasUsados = 0;
  let diasRestantes = 30;
  let podesolicitarFerias = true;
  let proximasFerias: string | undefined = undefined;
  const aprovadas = requests.filter((r) => r.status === "aprovado");
  if (aprovadas.length > 0) {
    // Pega a mais recente
    const ultima = aprovadas.sort((a, b) => new Date(b.dataFim).getTime() - new Date(a.dataFim).getTime())[0];
    const fim = new Date(ultima.dataFim);
    const diff = (hoje.getTime() - fim.getTime()) / (1000 * 60 * 60 * 24);
    if (diff < 365) {
      diasUsados = 30;
      diasRestantes = 0;
      podesolicitarFerias = false;
      const proxima = new Date(fim);
      proxima.setDate(proxima.getDate() + 365);
      proximasFerias = proxima.toLocaleDateString("pt-BR");
    }
  }
  return { totalDias, diasUsados, diasRestantes, podesolicitarFerias, proximasFerias };
}
import type { VacationRequest, VacationStats } from "@/types"

// Mock vacation requests data - replace with API calls later
export const mockVacationRequests: VacationRequest[] = [
  {
    id: "1",
    funcionarioMatricula: "12345",
    funcionarioNome: "João Silva",
    dataInicio: "2024-07-15",
    dataFim: "2024-08-13",
    status: "aprovado",
    dataSolicitacao: "2024-06-01",
    aprovadoPor: "Maria Santos",
    dataAprovacao: "2024-06-02",
  },
  {
    id: "2",
    funcionarioMatricula: "11111",
    funcionarioNome: "Pedro Costa",
    dataInicio: "2025-02-10",
    dataFim: "2025-03-11",
    status: "pendente",
    dataSolicitacao: "2024-12-15",
  },
  {
    id: "3",
    funcionarioMatricula: "22222",
    funcionarioNome: "Ana Oliveira",
    dataInicio: "2024-12-02",
    dataFim: "2024-12-31",
    status: "rejeitado",
    dataSolicitacao: "2024-11-01",
    aprovadoPor: "Maria Santos",
    dataAprovacao: "2024-11-02",
    observacoes: "Período muito próximo ao final do ano, muitos funcionários já solicitaram férias neste período.",
  },
]

// utils/vacation.ts  (substitua as funções antigas por estas)

export const parseISODate = (iso: string): Date => {
  // iso esperado: "YYYY-MM-DD"
  if (!iso) return new Date(NaN)
  const parts = iso.split("-").map((p) => Number(p))
  if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) return new Date(NaN)
  const [y, m, d] = parts
  return new Date(y, m - 1, d) // cria date no timezone local (sem deslocamento UTC)
}

export const formatISODate = (date: Date): string => {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return ""
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

export const formatBRDate = (date: Date): string => {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return ""
  const d = String(date.getDate()).padStart(2, "0")
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const y = date.getFullYear()
  return `${d}/${m}/${y}`
}

// Retorna a data "hoje" no timezone de São Paulo como um Date com hora zerada (00:00 local)
export const getBrazilianDate = (): Date => {
  const now = new Date()
  // extrai componentes diretamente no timezone desejado
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
  }).formatToParts(now)

  const map = Object.fromEntries(parts.map((p) => [p.type, p.value]))
  const year = Number(map.year)
  const month = Number(map.month)
  const day = Number(map.day)
  const hour = Number(map.hour ?? 0)
  const minute = Number(map.minute ?? 0)
  const second = Number(map.second ?? 0)

  // cria Date no timezone local representando o horário de São Paulo neste momento,
  // depois zeramos horas (comparações serão feitas apenas por dia)
  const dateInSP = new Date(year, month - 1, day, hour, minute, second)
  dateInSP.setHours(0, 0, 0, 0)
  return dateInSP
}

export const isWeekend = (date: Date): boolean => {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return false
  const day = date.getDay()
  // Se você quer proibir sexta, sábado e domingo, mantenha 5,6,0.
  // Se quiser apenas sábado e domingo, use: day === 6 || day === 0
  return day === 5 || day === 6 || day === 0 // sexta, sábado, domingo
}

export const isValidVacationDate = (startDate: string): { valid: boolean; message?: string } => {
  const today = getBrazilianDate() // já com hora zerada
  const start = parseISODate(startDate)
  if (!(start instanceof Date) || Number.isNaN(start.getTime())) {
    return { valid: false, message: "Data inicial inválida" }
  }
  start.setHours(0, 0, 0, 0)

  // Cannot request vacation in the past or today
  if (start <= today) {
    return { valid: false, message: "Não é possível solicitar férias no passado ou no dia atual" }
  }

  // Cannot start vacation on forbidden days (sexta/sáb/dom se essa for sua regra)
  if (isWeekend(start)) {
    return { valid: false, message: "Não é possível iniciar férias na sexta-feira, sábado ou domingo" }
  }

  // Check if start date is at least 1 day in the future
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)
  if (start < tomorrow) {
    return { valid: false, message: "As férias devem começar pelo menos no dia seguinte" }
  }

  return { valid: true }
}

export const calculateVacationEnd = (startDate: string): string => {
  const start = parseISODate(startDate)
  if (!(start instanceof Date) || Number.isNaN(start.getTime())) return ""
  const end = new Date(start)
  end.setDate(start.getDate() + 29) // 30 dias total (inclui o dia de início)
  return formatISODate(end)
}

export const canRequestVacation = (matricula: string): { can: boolean; message?: string } => {
  const lastVacation = mockVacationRequests
    .filter((req) => req.funcionarioMatricula === matricula && req.status === "aprovado")
    .sort((a, b) => parseISODate(b.dataFim).getTime() - parseISODate(a.dataFim).getTime())[0]

  if (!lastVacation) {
    return { can: true }
  }

  const lastVacationEnd = parseISODate(lastVacation.dataFim)
  if (Number.isNaN(lastVacationEnd.getTime())) return { can: true } // defensivo

  const today = getBrazilianDate()
  // diferenças sempre usando ms/day com horas zeradas
  const msPerDay = 1000 * 60 * 60 * 24
  const daysSinceLastVacation = Math.floor((today.getTime() - lastVacationEnd.getTime()) / msPerDay)

  if (daysSinceLastVacation < 365) {
    const daysRemaining = 365 - daysSinceLastVacation
    const nextAvailableDate = new Date(lastVacationEnd)
    nextAvailableDate.setDate(nextAvailableDate.getDate() + 365)

    return {
      can: false,
      message: `Você só pode solicitar férias novamente em ${daysRemaining} dias (${formatBRDate(nextAvailableDate)})`,
    }
  }

  // Check for pending requests
  const pendingRequest = mockVacationRequests.find(
    (req) => req.funcionarioMatricula === matricula && req.status === "pendente",
  )

  if (pendingRequest) {
    return {
      can: false,
      message: "Você já possui uma solicitação de férias pendente",
    }
  }

  return { can: true }
}

export const getVacationStats = (matricula: string): VacationStats => {
  const userRequests = mockVacationRequests.filter((req) => req.funcionarioMatricula === matricula)
  const approvedRequests = userRequests.filter((req) => req.status === "aprovado")

  const totalDias = 30
  const currentYear = getBrazilianDate().getFullYear()

  // Count approved vacation days in current year (comparando ano de dataInicio usando parseISODate)
  const currentYearApproved = approvedRequests.filter((req) => {
    const vacStart = parseISODate(req.dataInicio)
    return vacStart.getFullYear() === currentYear
  })

  const diasUsados = currentYearApproved.length * 30
  const diasRestantes = Math.max(0, totalDias - diasUsados)

  const lastApproved = approvedRequests.sort((a, b) => parseISODate(b.dataFim).getTime() - parseISODate(a.dataFim).getTime())[0]

  let proximasFerias: string | undefined
  if (lastApproved) {
    const nextAvailable = new Date(parseISODate(lastApproved.dataFim))
    nextAvailable.setDate(nextAvailable.getDate() + 365)
    proximasFerias = formatBRDate(nextAvailable)
  }

  const canRequest = canRequestVacation(matricula)

  return {
    totalDias,
    diasUsados,
    diasRestantes,
    proximasFerias,
    podesolicitarFerias: canRequest.can,
  }
}

export const submitVacationRequest = async (
  request: Omit<VacationRequest, "id" | "dataSolicitacao" | "status">,
): Promise<boolean> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Additional validation before submission
  const dateValidation = isValidVacationDate(request.dataInicio)
  if (!dateValidation.valid) {
    throw new Error(dateValidation.message)
  }

  const canRequest = canRequestVacation(request.funcionarioMatricula)
  if (!canRequest.can) {
    throw new Error(canRequest.message)
  }

  const newRequest: VacationRequest = {
    ...request,
    id: Date.now().toString(),
    dataSolicitacao: formatISODate(getBrazilianDate()), // usa data correta de SP
    status: "pendente",
  }

  mockVacationRequests.push(newRequest)
  return true
}


// Aprova solicitação de férias via PATCH na API
export const approveVacationRequest = async (requestId: string, approverMatricula: string, justificativa?: string): Promise<boolean> => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const token = localStorage.getItem("vacation-token");
  if (!token) return false;
  try {
    const res = await fetch(`${API_URL}/solicitacoes/${requestId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        avaliador: { matricula: approverMatricula },
        justificativa_avaliador: justificativa || "",
        status: "aprovado"
      })
    });
    return res.ok;
  } catch {
    return false;
  }
}


// Rejeita solicitação de férias via PATCH na API
export const rejectVacationRequest = async (
  requestId: string,
  approverMatricula: string,
  justificativa?: string,
): Promise<boolean> => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const token = localStorage.getItem("vacation-token");
  if (!token) return false;
  try {
    const res = await fetch(`${API_URL}/solicitacoes/${requestId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        avaliador: { matricula: approverMatricula },
        justificativa_avaliador: justificativa || "",
        status: "rejeitado"
      })
    });
    return res.ok;
  } catch {
    return false;
  }
}

export const hasConflictingVacations = (startDate: string, endDate: string, excludeRequestId?: string): boolean => {
  const start = parseISODate(startDate)
  const end = parseISODate(endDate)
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return false

  return mockVacationRequests.some((req) => {
    if (req.id === excludeRequestId || req.status === "rejeitado") return false
    const reqStart = parseISODate(req.dataInicio)
    const reqEnd = parseISODate(req.dataFim)
    if (Number.isNaN(reqStart.getTime()) || Number.isNaN(reqEnd.getTime())) return false
    // overlap
    return start <= reqEnd && end >= reqStart
  })
}

export const getVacationCalendar = (year: number, month: number) => {
  const startOfMonth = new Date(year, month, 1)
  const endOfMonth = new Date(year, month + 1, 0)

  const vacationsInMonth = mockVacationRequests.filter((req) => {
    if (req.status !== "aprovado") return false
    const vacStart = parseISODate(req.dataInicio)
    const vacEnd = parseISODate(req.dataFim)
    return vacStart <= endOfMonth && vacEnd >= startOfMonth
  })

  return vacationsInMonth
}
