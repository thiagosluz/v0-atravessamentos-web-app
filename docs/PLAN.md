# 🚨 Plano de Recuperação Pós-Atualização (Breaking Changes)

## 🎯 Objetivo
Analisar os erros gerados após a atualização forçada para a versão `--latest` das dependências principais e propor um plano seguro para restaurar a estabilidade do sistema.

## 🕵️ Análise dos Erros (Pesquisa & Diagnóstico)

1. **`lucide-react` (Erro de Ícones Faltantes)**
   - **Causa:** A partir da versão 1.x, a equipe do Lucide removeu **todos os ícones de marcas (Brand Icons)** por questões de direitos autorais (Instagram, Youtube, Linkedin).
   - **Impacto:** Quebrou o rodapé, contatos e configurações do painel.

2. **`react-resizable-panels` (Erro no PanelGroup)**
   - **Causa:** A versão 4.x trouxe quebras de contrato graves para alinhar com padrões web. O componente `PanelGroup` foi renomeado e `PanelResizeHandle` também.
   - **Impacto:** Quebrou o layout ajustável principal do Shadcn UI (`components/ui/resizable.tsx`).

3. **`react-day-picker` (Erro no Calendar `table`)**
   - **Causa:** A versão 10.x removeu as props legadas e mudou a estrutura do `classNames`.
   - **Impacto:** Quebrou a folha de estilos do calendário (`components/ui/calendar.tsx`).

4. **`recharts` (Erro de Tipagem no Chart)**
   - **Causa:** A versão 3.x mudou a tipagem interna do `payload` e do `LegendProps`. O componente nativo do Shadcn (`chart.tsx`) ainda não tem suporte oficial completo sem refatoração manual pesada para a v3.
   - **Impacto:** Quebrou os gráficos do Radar do Coletivo.

---

## 🛠️ Opções de Solução

### 🔴 Opção A: Rollback Cirúrgico (RECOMENDADO)
A aplicação estava **100% testada e estável**. O caminho mais prudente em projetos em produção é reverter *apenas* esses quatro pacotes para a versão major anterior onde o contrato do Shadcn UI funciona nativamente.
- Reverter `lucide-react` para `0.479.0` (ou similar antes da v1)
- Reverter `recharts` para `2.15.0`
- Reverter `react-day-picker` para `8.10.1` ou `9.x` compatível
- Reverter `react-resizable-panels` para `2.1.9`
> **Esforço**: Baixíssimo | **Risco**: Zero

### 🟡 Opção B: Refatoração Front-end (Atualização Forçada)
Se você realmente quiser manter as bibliotecas na última versão, precisaremos:
1. Instalar `@icons-pack/react-simple-icons` e substituir todas as menções do Lucide para Instagram/Youtube/Linkedin.
2. Reescrever o componente `resizable.tsx` para os novos nomes da v4.
3. Reescrever as chaves do `calendar.tsx` adaptando para o layout v10 do day-picker.
4. Tentar suprimir ou consertar os tipos complexos de generic do `recharts` v3 no `chart.tsx`.
> **Esforço**: Alto | **Risco**: Médio (Pode gerar quebras visuais secundárias).

## 🚦 Perguntas Abertas / User Review Required

> [!IMPORTANT]  
> Qual caminho você prefere seguir? 
> Responda com **A** (Fazer o downgrade das libs específicas e voltar ao verde imediato) ou **B** (Manter a versão latest e começar a reescrever o código do Shadcn e dos Ícones).
