import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Pontes para todos os corpos — Atravessamentos",
  description: "Nosso compromisso em tornar a travessia digital acessível a todos.",
}

export default function AcessibilidadePage() {
  return (
    <>
      <header className="mb-12">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Inclusão</span>
        <h1 className="mt-4 text-4xl md:text-5xl font-bold leading-tight">Pontes para todos os corpos</h1>
      </header>

      <section>
        <p>
          A travessia só é real se todos puderem atravessar. No Coletivo Atravessamentos, acreditamos que a <strong>acessibilidade digital</strong> é um direito fundamental e uma premissa para a democratização da arte e da educação.
        </p>

        <h2>Nosso Compromisso</h2>
        <p>
          Estamos em um processo contínuo de aprendizado e melhoria para garantir que este site seja habitável por pessoas com diferentes habilidades e necessidades. Buscamos seguir as diretrizes de acessibilidade para conteúdo web (WCAG 2.1).
        </p>

        <h2>Recursos Implementados</h2>
        <ul>
          <li><strong>Navegação por Teclado:</strong> O site foi estruturado para que todas as funções importantes sejam acessíveis sem o uso de mouse.</li>
          <li><strong>Contraste e Tipografia:</strong> Escolhemos cores e fontes que priorizam a legibilidade e o conforto visual, mesmo em condições de baixa visibilidade.</li>
          <li><strong>Compatibilidade com Leitores de Tela:</strong> Utilizamos semântica HTML correta e rótulos ARIA para facilitar a navegação por softwares de leitura.</li>
          <li><strong>Design Responsivo:</strong> O conteúdo se adapta a diferentes tamanhos de tela e níveis de zoom, sem perda de informação.</li>
        </ul>

        <h2>Estado do Trabalho</h2>
        <p>
          Sabemos que a acessibilidade é um horizonte, não um destino final. Alguns de nossos conteúdos históricos ou projetos multimídia podem ainda apresentar barreiras que estamos trabalhando para remover.
        </p>

        <h2>Convite Aberto</h2>
        <p>
          Se você encontrar qualquer degrau alto demais ou uma ponte interrompida (barreira de acesso), por favor, nos avise. Seu feedback é essencial para que possamos construir rampas melhores.
        </p>
        <p>
          Você pode entrar em contato conosco através do e-mail listado em nossa página de contato ou redes sociais.
        </p>

        <div className="mt-12 pt-8 border-t border-border/50 italic text-sm text-foreground/50">
          Última atualização: Maio de 2024.
        </div>
      </section>
    </>
  )
}
