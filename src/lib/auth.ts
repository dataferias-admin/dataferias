import type { User } from "@/types"

const API_URL = process.env.NEXT_PUBLIC_API_URL

// Faz login na API e retorna o usuário autenticado se sucesso, além de salvar o token no localStorage
export const authenticateUser = async (matricula: string, senha: string): Promise<User | null> => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ matricula, senha }),
    });

    if (!response.ok) return null;

    const data = await response.json();
    const user = data.funcionario;
    const token = data.token;
    if (!token) return null;

    // Salva o token no localStorage
    localStorage.setItem("vacation-token", token);

    // Decodifica o token para obter dados do usuário (ou faz uma chamada para /me futuramente)
    // Por enquanto, retorna apenas a matrícula e função do payload, se disponível
    // Aqui, para simplificação, retorna apenas a matrícula usada no login
    // Ideal: criar endpoint /me para buscar dados completos do usuário
    return user as User;
  } catch (error) {
    console.error("Erro ao autenticar:", error);
    return null;
  }
};

// Faz cadastro na API e retorna true se sucesso
export const registerUser = async (userData: Omit<User, "matricula"> & { matricula: string }): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/funcionarios`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    if (response.status === 201) {
      return true;
    }
    return false;
  } catch (error) {
    console.error("Erro ao cadastrar:", error);
    return false;
  }
};
