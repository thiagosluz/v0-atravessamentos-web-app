# Guia do Administrador - Coletivo Atravessamentos

Este guia descreve como utilizar as ferramentas administrativas do site para gerenciar conteúdos e visualizar o pulso do coletivo.

## 📊 Visão Geral (Dashboard)

A aba **Visão Geral** é o seu centro de comando. Nela você encontra:

- **Banner de Boas-Vindas:** Mostra um resumo das atividades nos últimos 30 dias.
- **Últimas Atualizações:** Lista cronológica dos últimos 5 itens editados (Projetos, Posts ou Membros).
- **Pendentes:** Atalhos rápidos para conteúdos que ainda estão como *Rascunho* ou *Em Revisão*.
- **Temas dos Projetos:** Gráfico que mostra a distribuição dos seus projetos por categoria.

## ⌨️ Atalhos de Teclado (Produtividade)

O painel detecta automaticamente o seu sistema operacional para oferecer os melhores atalhos:

- **Mac:** `Cmd + K`
- **Windows / Linux:** `Ctrl + K`

Ao abrir o **Centro de Comando**, você pode:
1. Buscar qualquer conteúdo pelo título.
2. Navegar entre as abas do painel (Projetos, Membros, Blog, Configurações).
3. **Ver Site Público:** Retornar para a visualização dos visitantes.

## 🔄 Navegação entre Contextos

Existem três formas de voltar para o site público a partir do Admin:
1. Clicando no nome **"atravessamentos"** no topo da barra lateral.
2. Clicando no botão **"Ver site"** no cabeçalho superior.
3. Usando o comando **"Ver Site Público"** no menu `Cmd+K`.

## 📈 Estatísticas Mensais

Os cards no topo do painel possuem um indicador verde (ex: `+2`). Esse número representa a quantidade de itens que foram criados ou atualizados nos últimos 30 dias, permitindo acompanhar o crescimento do acervo.

## 📧 Newsletter e Broadcast

O sistema de e-mails é automatizado para facilitar a comunicação com seus assinantes.

### Como funciona o disparo:
1. **Gatilho**: Ao mudar o status de uma notícia para **"Publicado"** e salvar, o sistema dispara automaticamente um e-mail para todos os assinantes da sua lista no Resend.
2. **Segurança de Re-envio**: O sistema registra a data de envio na coluna `newsletter_sent_at`. Isso garante que, se você editar a notícia futuramente, o e-mail **não será enviado novamente**.
3. **Descadastramento**: Todos os e-mails contêm um link automático de "Descadastrar" que remove o usuário da lista sem necessidade de intervenção manual.

### Recomendações:
- Certifique-se de que a imagem de capa da notícia seja de alta qualidade, pois ela será o destaque do e-mail.
- Teste o layout criando uma notícia de teste e apagando-a em seguida, se desejar.

---
*Dúvidas técnicas ou erros? Entre em contato com a equipe de desenvolvimento.*
