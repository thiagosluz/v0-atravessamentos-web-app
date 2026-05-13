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
2. Navegar entre as abas do painel (Projetos, Membros, Blog, Identidade Visual, Configurações).
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

## 🎨 Identidade Visual e Assets

A aba **Identidade Visual** permite gerenciar a alma estética do site sem precisar de conhecimentos técnicos em edição de imagem.

### Gestão de Imagens (Hero e Sobre)
- **Recorte Orgânico Automático**: Qualquer imagem enviada para o Hero ou para a colagem da seção Sobre receberá automaticamente as bordas irregulares e os filtros de cor do Coletivo.
- **Restauração de Padrão**: Caso queira remover uma imagem personalizada e voltar para a ilustração artística original, basta clicar no botão **"X"** (vermelho) sobre a imagem e salvar as alterações.

### Estatísticas de Impacto
No final da página de Identidade Visual, você pode atualizar os números que contam a história do coletivo:
- **Exibição Inteligente**: Se um campo (Anos, Projetos ou Cidades) for deixado em branco, ele será automaticamente ocultado na landing page. Isso permite que você mostre apenas os dados que possui no momento.

## 🖼️ Acervo (Galeria de Mídias)

O painel de **Acervo** foi projetado para ser um repositório centralizado de todas as memórias visuais do coletivo.

- **Upload em Lote**: Você pode enviar até 20 fotos simultaneamente. Basta arrastar os arquivos para a zona tracejada.
- **Hashtags Conceituais**: Gerencie tags globais que ajudam a organizar o acervo por temas (ex: #cerrado, #performance).
- **Curadoria Sequencial**: Ao clicar em uma imagem do acervo, você abre um modal de edição que permite navegar rapidamente para a próxima foto, facilitando a catalogação em massa.

## 🏛️ Exposições (Salas de Curadoria)

Nesta seção, você cria as narrativas visuais do site. Uma exposição é uma coleção curada de ativos do seu acervo.

- **Layout Padronizado**: Assim como o restante do dashboard, este painel utiliza um cabeçalho claro e amplo espaçamento para facilitar a gestão das salas.
- **Mesa de Curadoria**: Ao criar ou editar uma exposição, você verá um mural com todas as fotos do seu acervo. Basta selecionar as que deseja "pendurar" na sala virtual.
- **Status de Inauguração**: Use o status "Publicado" para tornar a exposição visível no site público ou "Rascunho" para continuar trabalhando na curadoria.

## 👥 Gestão de Membros

A aba **Membros** permite gerenciar a equipe e os integrantes do coletivo, mantendo o histórico de suas trajetórias sempre atualizado.

- **Minibio Rica (Editor Tiptap):** O campo de biografia utiliza o mesmo editor de texto avançado do Diário. Isso significa que você pode adicionar formatação, listas, itálico e negrito na biografia de cada integrante para criar narrativas mais imersivas.
- **Currículo Lattes:** Na aba de contatos, é possível fornecer o link oficial do Currículo Lattes do membro. Caso preenchido, um ícone de livro aberto (📖) aparecerá automaticamente na página de perfil público do membro no site.
- **Categorização:** Assim como no Diário, os membros recebem "tags" (Ex: Educadoras, Artistas) que influenciam na cor do badge exibido no portal.

## ⚙️ Configurações Gerais

Nesta aba, você gerencia informações institucionais, links de redes sociais e textos legais (Privacidade e Termos).

---
*Dúvidas técnicas ou erros? Entre em contato com a equipe de desenvolvimento.*
