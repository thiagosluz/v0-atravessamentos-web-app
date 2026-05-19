# Plano de Resolução: Erro 404 no Painel Admin (GET /admin)

> **Contexto**: O usuário reportou um erro `GET /admin 404` com o seguinte log de tempo:
> `GET /admin 404 in 124ms (next.js: 9ms, proxy.ts: 85ms, application-code: 30ms)`

---

## 🔍 Análise de Causa Raiz

Abaixo estão as hipóteses mais prováveis para o erro `404` no painel administrativo `/admin`:

1. **Falha Silenciosa em `proxy.ts` (Edge Runtime)**:
   - A chamada `await supabase.auth.getUser()` em `/proxy.ts` é executada sem um bloco `try-catch`.
   - Se as credenciais do Supabase estiverem ausentes no ambiente ou se o banco de dados falhar/estiver indisponível temporariamente, a função lançará uma exceção não tratada na Edge Runtime, fazendo com que o Next.js falhe e retorne um erro genérico de recurso não encontrado (404) ou 500.
2. **Corrupção de Cache do Next.js (`.next`)**:
   - Alterações profundas recentes em Server Actions, hooks customizados (`useAsyncData`), e rotas podem gerar inconsistências no cache de compilação do Next.js 16, resultando em 404s fantasmas em rotas dinâmicas.
3. **Loop de Redirecionamento ou Estado de Cookie Inválido**:
   - Um token JWT expirado ou corrompido no cookie do Supabase pode causar comportamentos anômalos no middleware (`proxy.ts`), falhando na obtenção do usuário e gerando rotas não resolvidas.

---

## 🛠️ Plano de Ação em 3 Fases

### Fase 1: Análise e Robustez do Middleware (`proxy.ts`)
- Adicionar um bloco `try-catch` robusto em `proxy.ts` para capturar falhas na inicialização do Supabase ou na busca do usuário.
- Se houver falha de rede ou de autenticação, o middleware deve redirecionar com segurança para `/login` (ou permitir a requisição continuar e ser tratada no cliente), em vez de quebrar e retornar 404.

### Fase 2: Diagnóstico de Ambiente e Limpeza de Cache
- Validar as variáveis de ambiente do Supabase (`.env.local`).
- Executar uma limpeza profunda do diretório `.next` para eliminar quaisquer artefatos de build antigos ou corrompidos.
- Reiniciar o servidor de desenvolvimento (`pnpm dev`).

### Fase 3: Verificação Técnica Completa
- Executar checagens de tipos com o compilador do TypeScript.
- Executar os testes E2E do Playwright para garantir que o fluxo de autenticação e navegação para o painel admin esteja 100% verde.

---

## 🎼 Agentes Orquestrados Propostos (Fase 2)

| Agente | Escopo de Ação |
|--------|----------------|
| `debugger` | Investigar as variáveis de ambiente e o fluxo de autenticação. |
| `frontend-specialist` | Ajustar o `proxy.ts` para torná-lo resiliente a falhas e erros de conexão. |
| `test-engineer` | Rodar os testes de acessibilidade e E2E pós-correção. |

---

## 🚦 Critérios de Aceitação

- [x] A rota `/admin` carrega com sucesso (retorna status `200` se autenticado, ou `307/302` se não autenticado).
- [x] O arquivo `proxy.ts` possui tratamento de erro de conexão com Supabase.
- [x] Toda a suíte de testes E2E do Playwright roda e passa sem regressões.
