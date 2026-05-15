# 🛠️ Plano de Implementação: Testes Unitários (Vitest)

Este documento detalha os arquivos e casos de teste que serão implementados para expandir a cobertura de lógica pura, tratamento de erros e performance.

---

## 📅 Arquivos de Destino
- `__tests__/unit/lib/search-logic.test.ts`
- `__tests__/unit/actions/error-handling.test.ts`
- `__tests__/unit/hooks/use-admin-state.test.ts`
- `__tests__/unit/utils/performance.test.ts`

---

## 🧪 Casos de Teste Detalhados

### 1. `lib/search-logic.test.ts`
**Fonte:** `lib/actions/search.ts`
- **Ranking Básico:** Validar que termos exatos no título têm peso maior que na descrição.
- **Normalização:** Testar busca por "Ação" encontrando "acao", e vice-versa.
- **Caracteres Especiais:** Validar que símbolos ($, %, @) não quebram a query e são filtrados/tratados.
- **Vazio:** Garantir que busca vazia retorna todos os itens ou lista limpa conforme esperado.

### 2. `actions/error-handling.test.ts`
**Fonte:** `lib/actions/*.ts`
- **Mock do Supabase:** Simular `error.code` de timeout, falha de conexão e violação de chave estrangeira.
- **Asserção:** Garantir que o retorno segue o padrão `{ error: string }` com mensagens amigáveis em português.
- **Resiliência:** Validar que erros internos de JS (ex: `TypeError`) são capturados pelo wrapper de ação.

### 3. `hooks/use-admin-state.test.ts`
**Fonte:** `hooks/admin/use-admin-state.ts`
- **Filtragem:** Validar que a atualização de uma categoria reseta a paginação para 1.
- **Busca:** Validar o debounce interno do estado de busca.
- **Sincronização:** Testar a persistência parcial de filtros se houver integração com URL.

### 4. `utils/performance.test.ts`
**Fonte:** `lib/utils.ts`
- **Benchmark:** Medir tempo de execução de funções de filtragem de array grandes (ex: 5000+ itens).
- **Limite:** Definir um *threshold* máximo (ex: < 10ms) para utilitários críticos de UI.

---

## 🛠️ Orquestração de Agentes
1. **`backend-specialist`**: Implementa testes 1, 2 e 4.
2. **`frontend-specialist`**: Implementa teste 3 (hooks).
3. **`test-engineer`**: Executa `npm test` e verifica cobertura.

---
*Plano gerado em 14/05/2026. Aguardando aprovação para execução.*
