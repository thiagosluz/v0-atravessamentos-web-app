# Plano de Implementação: Detalhamento de Projetos no PDF do Membro

## 🎯 Objetivo
Melhorar o Portfólio em PDF do Membro adicionando, na listagem de "Projetos Vinculados", o resumo do projeto (`excerpt`) e um link clicável que direciona o usuário para a página pública do projeto no site (`/projetos/[id]`).

## 🏗️ Fases do Projeto

### Fase 1: Atualização do Template PDF (Frontend / PDF)
- [ ] Modificar o arquivo `components/admin/pdf/member-portfolio-pdf.tsx`.
- [ ] Injetar um novo bloco de texto contendo o `project.excerpt` logo abaixo dos metadados (categoria e datas).
- [ ] Estilizar esse texto do excerpt para ficar sutil e não roubar atenção do título (ex: fonte menor, itálico ou cinza mais claro).
- [ ] Adicionar um componente `PdfLink` do `@react-pdf/renderer` logo abaixo do excerpt.
  - O texto do link será "Ver no site ↗" (ou similar).
  - O `src` do link será o caminho absoluto para o site público. Como o PDF é gerado offline/isolado, precisaremos determinar a URL base dinamicamente (usando `window.location.origin` ou fallback).

### Fase 2: Validação e Testes
- [ ] Executar o `lint_runner.py` para garantir que as importações e tipagens do `@react-pdf/renderer` estão corretas.
- [ ] Executar o `security_scan.py` para checar injeções ou problemas.
- [ ] Executar o `checklist.py`.

## 🚨 Restrições
- Como os links em PDFs (`PdfLink`) precisam de URLs completas (`https://...`), precisamos garantir que `window.location.origin` (já que o PDF roda no Client Side) seja capturado e concatenado com o ID do projeto para formar a URL absoluta.
- Manter o design limpo: não deixar a seção de projetos gigante, o excerpt deve ser visualmente compacto.
