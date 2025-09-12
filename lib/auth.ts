import type { User } from "@/types"

// Mock users data - replace with API calls later
export const mockUsers: User[] = [
  {
    matricula: "12345",
    nome: "João Silva",
    funcao: "funcionario",
    senha: "123456",
  },
  {
    matricula: "67890",
    nome: "Maria Santos",
    funcao: "gestor",
    senha: "123456",
  },
  {
    matricula: "11111",
    nome: "Pedro Costa",
    funcao: "funcionario",
    senha: "123456",
  },
  {
    matricula: "22222",
    nome: "Ana Oliveira",
    funcao: "funcionario",
    senha: "123456",
  },
]

export const authenticateUser = async (matricula: string, senha: string): Promise<User | null> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const user = mockUsers.find((u) => u.matricula === matricula && u.senha === senha)
  return user || null
}

export const registerUser = async (userData: Omit<User, "matricula"> & { matricula: string }): Promise<boolean> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Check if user already exists
  const existingUser = mockUsers.find((u) => u.matricula === userData.matricula)
  if (existingUser) {
    return false
  }

  // Add new user to mock data
  mockUsers.push(userData)
  return true
}
