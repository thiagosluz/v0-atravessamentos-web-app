# Plano de Refatoração: Zod 4 e React Hook Form

## Objetivo
Resolver os erros de tipagem TypeScript introduzidos pela atualização das dependências `@hookform/resolvers`, `sonner` e `zod` para suas versões mais recentes (ex: Zod v4).

## Contexto dos Erros
A atualização mais recente gerou 8 erros de compilação:
1. **ZodError `errors` ausente**: No Zod v4 (ou dependendo da inferência de tipos mais restrita do TypeScript), acessar `.errors` em um erro capturado do tipo `ZodError<unknown>` passou a exigir o uso correto de propriedades e tipagens. O recomendado é usar `.issues` ou tipar corretamente `error as z.ZodError`.
2. **React Hook Form `getValues` e `watch`**: O retorno agora prevê `undefined` caso os defaults não resolvam corretamente os arrays, gerando `currentTags is possibly 'undefined'`.
3. **React Hook Form Input `value`**: O controle `field.value` possui tipo `string | null | undefined`, porém o `<Input />` (React 19 / HTML types) não aceita `null`.

## Proposed Changes

### Component Name: Formulário de Admin
Refatorar o modal de edição de ativos do acervo para tratar os valores `undefined` e `null`.
#### [MODIFY] [edit-asset-modal.tsx](file:///home/thiago/Projetos/v0-atravessamentos-web-app/components/admin/shared/edit-asset-modal.tsx)
- Corrigir a lógica de `currentTags`: `const currentTags = form.getValues("tags") || []` e `form.watch("tags") || []`.
- Corrigir o input de Location: Adicionar fallback para null: `value={field.value || ""}`.

### Component Name: Server Actions
Refatorar o tratamento de erros do Zod nas actions.
#### [MODIFY] [contact.ts](file:///home/thiago/Projetos/v0-atravessamentos-web-app/lib/actions/contact.ts)
- Linha 92: Mudar de `error.errors[0].message` para `error.issues[0].message` ou asserção explícita.
#### [MODIFY] [safe-action.ts](file:///home/thiago/Projetos/v0-atravessamentos-web-app/lib/utils/safe-action.ts)
- Linha 44: Mudar de `error.errors.map` para `error.issues.map`.

## Verification Plan

### Automated Tests
- `npx tsc --noEmit` para garantir 0 erros de tipo.
- `pnpm lint`
- `pnpm test` (Unitários) e `pnpm test:e2e` (Playwright) para garantir que formulários e validações ainda funcionam com a nova versão do Zod.
- `pnpm run build` para garantir que o Turbopack consegue compilar tudo sem erros de tipagem.

## User Review Required
> [!IMPORTANT]
> Aprovação Necessária
> Aguardando aprovação deste plano para invocar os especialistas de Frontend e Testes para aplicar as correções e rodar o pipeline.
