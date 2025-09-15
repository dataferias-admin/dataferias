# Sistema de Gestão de Férias

Sistema corporativo moderno para gestão de férias de funcionários, desenvolvido com Next.js 15, TypeScript, Tailwind CSS, shadcn/ui, ESLint e Zod.

## 🚀 Funcionalidades

### Para Funcionários
- ✅ Cadastro e login com matrícula e senha
- ✅ Visualização de estatísticas de férias (dias totais, usados, restantes)
- ✅ Solicitação de férias com validações automáticas
- ✅ Histórico de solicitações com status
- ✅ Interface responsiva e moderna

### Para Gestores
- ✅ Todas as funcionalidades de funcionário
- ✅ Dashboard com estatísticas gerais da equipe
- ✅ Aprovação/rejeição de solicitações pendentes
- ✅ Histórico completo com filtros e busca
- ✅ Visualização de todas as solicitações da empresa

## 🔧 Regras de Negócio Implementadas

1. **Validação de Datas**
   - ❌ Não é possível solicitar férias no passado ou no dia atual
   - ❌ Não é possível iniciar férias na sexta-feira, sábado ou domingo
   - ✅ Férias têm exatamente 30 dias de duração

2. **Controle de Periodicidade**
   - ✅ Só é possível solicitar férias uma vez a cada 365 dias (1 ano)
   - ✅ Sistema consulta histórico para verificar última férias aprovada
   - ✅ Cálculo automático da próxima data disponível

3. **Horário Brasileiro**
   - ✅ Todas as datas utilizam fuso horário de São Paulo
   - ✅ Validações consideram horário brasileiro

## 🛠️ Tecnologias Utilizadas

- **Next.js 15** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização utilitária
- **shadcn/ui** - Componentes de interface
- **Zod** - Validação de schemas
- **ESLint** - Linting de código
- **React Hook Form** - Gerenciamento de formulários

## 📁 Estrutura do Projeto

```plaintext
src/
├── app/                    # App Router do Next.js
│   ├── dashboard/         # Dashboard do funcionário
│   ├── manager/           # Dashboard do gestor
│   ├── login/             # Página de login
│   ├── register/          # Página de cadastro
│   └── layout.tsx         # Layout principal
├── components/            # Componentes React
│   ├── auth/              # Componentes de autenticação
│   ├── dashboard/         # Componentes do dashboard
│   ├── manager/           # Componentes do gestor
│   └── ui/                # Componentes de interface
├── contexts/              # Contextos React
│   └── auth-context.tsx   # Contexto de autenticação
├── lib/                   # Utilitários e lógica
│   ├── auth.ts            # Lógica de autenticação
│   ├── vacation.ts        # Lógica de férias
│   ├── validations.ts     # Schemas de validação
│   └── utils.ts           # Utilitários gerais
└── types/                 # Definições de tipos
    └── index.ts           # Tipos principais
```

## 🔌 Integração com Backend (Spring Boot)

### Endpoints Necessários

#### Autenticação
```typescript
// POST /api/auth/login
interface LoginRequest {
  matricula: string
  senha: string
}

interface LoginResponse {
  token: string
  user: {
    matricula: string
    nome: string
    funcao: "funcionario" | "gestor"
  }
}

// POST /api/auth/register
interface RegisterRequest {
  matricula: string
  nome: string
  funcao: "funcionario" | "gestor"
  senha: string
}
```

#### Gestão de Férias
```typescript
// GET /api/vacation/stats/{matricula}
interface VacationStatsResponse {
  totalDias: number
  diasUsados: number
  diasRestantes: number
  proximasFerias?: string
  podesolicitarFerias: boolean
}

// POST /api/vacation/request
interface VacationRequestPayload {
  funcionarioMatricula: string
  funcionarioNome: string
  dataInicio: string
  dataFim: string
  observacoes?: string
}

// GET /api/vacation/requests/{matricula}
// GET /api/vacation/requests (para gestores)
interface VacationRequest {
  id: string
  funcionarioMatricula: string
  funcionarioNome: string
  dataInicio: string
  dataFim: string
  status: "pendente" | "aprovado" | "rejeitado"
  dataSolicitacao: string
  observacoes?: string
  aprovadoPor?: string
  dataAprovacao?: string
}

// PUT /api/vacation/approve/{id}
// PUT /api/vacation/reject/{id}
interface ApprovalRequest {
  aprovadoPor: string
  observacoes?: string
}
```

### Arquivos para Modificar

1. **lib/auth.ts** - Substituir funções mock por chamadas de API
2. **lib/vacation.ts** - Substituir dados mock por chamadas de API
3. **contexts/auth-context.tsx** - Adicionar gerenciamento de JWT

### Exemplo de Integração

```typescript
// lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

export const api = {
  async login(matricula: string, senha: string) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ matricula, senha })
    })
    return response.json()
  },
  
  async getVacationStats(matricula: string, token: string) {
    const response = await fetch(`${API_BASE_URL}/vacation/stats/${matricula}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    return response.json()
  }
  
  // ... outros endpoints
}
```

## 👥 Usuários de Teste

```typescript
// Funcionários
{ matricula: "12345", nome: "João Silva", funcao: "funcionario", senha: "123456" }
{ matricula: "11111", nome: "Pedro Costa", funcao: "funcionario", senha: "123456" }
{ matricula: "22222", nome: "Ana Oliveira", funcao: "funcionario", senha: "123456" }

// Gestor
{ matricula: "67890", nome: "Maria Santos", funcao: "gestor", senha: "123456" }
```

## 🎨 Design System

O projeto utiliza um design system corporativo com:
- **Cores primárias**: Verde (#15803d) para confiança e eficiência
- **Cores neutras**: Branco, cinzas e tons de verde claro
- **Tipografia**: Geist Sans para interface moderna
- **Componentes**: shadcn/ui para consistência

## 🚀 Como Executar

1. Clone o repositório
2. Instale as dependências: `npm install`
3. Execute o projeto: `npm run dev`
4. Acesse: `http://localhost:3000`

## 📝 Próximos Passos

1. **Integração com Spring Boot**: Substituir dados mock por API real
2. **Autenticação JWT**: Implementar tokens de segurança
3. **Notificações**: Sistema de notificações por email
4. **Relatórios**: Geração de relatórios em PDF
5. **Calendário**: Visualização de férias em calendário
6. **Testes**: Implementar testes unitários e de integração

## 🔒 Segurança

- ✅ Validação de entrada com Zod
- ✅ Proteção de rotas por função
- ✅ Sanitização de dados
- ⏳ JWT para autenticação (a implementar)
- ⏳ Rate limiting (a implementar)
- ⏳ HTTPS obrigatório (a configurar)

---

**Desenvolvido com ❤️ usando Next.js 15 e tecnologias modernas**
