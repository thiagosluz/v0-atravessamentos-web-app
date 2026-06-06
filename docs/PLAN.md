# 🎨 Auditoria de Design e Consistência (Painel Admin)

## 🎯 Objetivo
Analisar todas as telas do painel administrativo (`/admin`) para verificar a consistência visual, hierarquia de informações e aderência à Identidade Visual do Coletivo Atravessamentos, propondo padronizações caso necessário.

## 🕵️ Resultados da Auditoria Visual

Após navegação automatizada e inspeção visual de todas as 10 abas (Visão Geral, Projetos, Acervo Vivo, Exposições, Diário, Newsletter, Membros, Configurações, Identidade Visual e Radar), a conclusão é:

**O design já está em um nível de excelência e altíssima consistência.**

### Pontos Fortes Identificados:
1. **Paleta de Cores Coesa**: O fundo em tom de areia (`#F9F6F1`) e os botões de ação/destaques em Terracota (`#A65A3C`) estão uniformes em todas as telas.
2. **Layout Base**: A estrutura de Sidebar fixa à esquerda e conteúdo rolável à direita, com o Command Menu (⌘K) no topo, está sólida e não quebra a responsividade.
3. **Componentização de Tabelas**: As abas de "Projetos", "Diário", "Membros" e "Newsletter" utilizam a mesma estrutura de `AdminDataTable`, garantindo a mesma experiência de ordenação, badges de status (`Publicado`, `Rascunho`) e botões de ação (Editar/Excluir).
4. **Cards e Galerias**: A aba de Exposições e o Acervo Vivo utilizam cards com o mesmo border-radius, sombreamento sutil e botões secundários com borda terracota perfeitamente alinhados.
5. **Tipografia**: A hierarquia de títulos principais vs metadados (como datas e categorias em letras menores e acinzentadas) está perfeitamente padronizada.

---

## 📋 Plano de Ação (Veredito)

**Não há necessidade de uma refatoração de padronização.** Os componentes base (modais, tabelas, botões e formulários) já compartilham a mesma biblioteca visual (provavelmente Radix/shadcn adaptado para a paleta do coletivo).

### 💡 Recomendações de Micro-Polimentos (Opcionais)
Apesar de não haver erros, se quisermos elevar ainda mais a UX, o plano de implementação poderia incluir apenas:

1. **Skeleton Loaders**: Adicionar animações de carregamento em formato de "esqueleto" nas tabelas enquanto os dados chegam do Supabase (para evitar pulos de layout).
2. **Empty States Padronizados**: Garantir que se uma aba não tiver nenhum item (ex: 0 projetos criados), haja uma ilustração bonita em tom de terracota convidando o usuário a criar o primeiro.

> **Conclusão do Planejamento**: O sistema não precisa de correções de design. O plano atual é apenas manter o padrão estabelecido e focar em novas funcionalidades.
