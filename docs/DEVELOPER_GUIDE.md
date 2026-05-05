# 💻 Guia do Desenvolvedor

Informações técnicas para manutenção e expansão do projeto.

---

## 🛠️ Padrões de Código

### 🎨 Tailwind CSS
- Evite cores "hardcoded" (hexadecimais) diretamente no JSX sempre que possível. Use as variáveis do tema ou as classes de utilitário.
- Para componentes dinâmicos, usamos o `cn()` helper (Tailwind Merge + CLSX).

### ⚛️ React & Next.js
- **Server Actions**: Devem ser mantidas em `lib/actions/` e exportadas com `"use server"`.
- **Componentes**: Devem ser pequenos e focados. Se um componente precisa de estado complexo, avalie movê-lo para um componente de cliente separado.

---

## 🔄 Fluxo de Desenvolvimento

1. Crie uma branch para a nova funcionalidade.
2. Desenvolva e teste localmente usando `pnpm dev`.
3. Verifique se as alterações no banco de dados (Supabase) precisam de novas políticas de RLS.
4. Faça o push e abra um Pull Request.

---

## 📦 Dependências Principais e Porquê
- **motion (framer-motion)**: Escolhida pela facilidade de criar animações de entrada e gestos.
- **lucide-react**: Conjunto de ícones leve e consistente.
- **shadcn/ui**: Base de componentes acessíveis e customizáveis.
- **date-fns**: Manipulação de datas para o Diário e Linha do Tempo.

---

## 🧪 Próximos Passos Sugeridos
Para manter a qualidade do código conforme o projeto cresce:
- Implementar **Playwright** para testes de regressão no fluxo de Admin.
- Adicionar **Vitest** para testar as Server Actions.
- Implementar **Sentry** para monitoramento de erros em produção.

---

## 🛠️ Comandos Úteis

```bash
# Inicia ambiente dev
pnpm dev

# Build de produção
pnpm build

# Lint de código
pnpm lint
```
