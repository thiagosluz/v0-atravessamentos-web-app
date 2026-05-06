# Plano de Documentação - Atualização Estrutural

Este plano descreve as etapas para atualizar a documentação do projeto **Atravessamentos** para refletir as novas funcionalidades de SEO, Gestão de Conteúdo e Processamento de Imagens.

## 📝 Tarefas de Documentação

### 1. Atualização do README.md
- **Responsável**: `documentation-writer`
- **Foco**: 
  - Adicionar as novas funcionalidades na seção "Recursos".
  - Atualizar a stack tecnológica (adicionando `date-fns`, `isomorphic-dompurify`).
  - Incluir guia rápido de configuração do Supabase Storage (bucket `site-assets`).

### 2. Guia de SEO e Identidade Digital
- **Responsável**: `seo-specialist`
- **Foco**:
  - Explicar como funciona o sistema híbrido de SEO (Global vs Granular).
  - Documentar o utilitário `constructMetadata` para futuros desenvolvedores.
  - Guia de melhores práticas para preenchimento de metadados no Admin.

### 3. Documentação de Componentes Admin (Smart Upload & Preview)
- **Responsável**: `frontend-specialist`
- **Foco**:
  - Documentar o funcionamento técnico do `SmartImageUpload` (Canvas API).
  - Explicar o simulador `SEOPreview`.
  - Instruções de manutenção para as abas de conteúdo dinâmico.

## 🛠️ Verificação Final
- Executar `security_scan.py` para garantir que as novas URLs de imagem e sanitização HTML estão seguras.
- Validar links internos na documentação.

---
## 🏁 Cronograma de Implementação
1. **Fase 2.1**: Atualização do README.md
2. **Fase 2.2**: Criação de `docs/SEO.md`
3. **Fase 2.3**: Criação de `docs/COMPONENTS.md`
