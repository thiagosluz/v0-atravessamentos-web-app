import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Acordos de Convivência — Atravessamentos",
  description: "Entenda como habitamos este espaço digital comum.",
}

export default function TermosPage() {
  return (
    <>
      <header className="mb-12">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Ética Coletiva</span>
        <h1 className="mt-4 text-4xl md:text-5xl font-bold leading-tight">Acordos de Convivência</h1>
      </header>

      <section>
        <p>
          Este site não é apenas uma vitrine, mas um território compartilhado de pesquisa, arte e educação. Ao navegar por aqui, você aceita nossos <strong>acordos de convivência</strong>, baseados no respeito mútuo e na valorização do conhecimento coletivo.
        </p>

        <h2>1. Habitabilidade</h2>
        <p>
          O conteúdo aqui exposto é fruto de anos de disputa e afeto. Você é livre para explorar, aprender e se inspirar, desde que faça uso ético destas informações. Não é permitido o uso deste espaço para fins de ódio, discriminação ou qualquer atividade que fira a dignidade humana.
        </p>

        <h2>2. Autoria e Compartilhamento</h2>
        <p>
          Muitos dos textos, imagens e projetos aqui apresentados são protegidos por direitos autorais ou licenças específicas do Coletivo Atravessamentos. 
        </p>
        <ul>
          <li><strong>Citação:</strong> Se algo aqui te atravessou e você quer levar adiante, cite a fonte. O reconhecimento do trabalho intelectual e artístico é fundamental.</li>
          <li><strong>Uso Comercial:</strong> Para qualquer uso comercial de nossas obras, entre em contato conosco para uma conversa e autorização formal.</li>
        </ul>

        <h2>3. Nossa Responsabilidade</h2>
        <p>
          Dedicamos esforço constante para que as informações aqui contidas sejam precisas e atualizadas. No entanto, o conhecimento é vivo e está em constante transformação. Não nos responsabilizamos por interpretações distorcidas ou pelo uso indevido do conteúdo fora deste contexto.
        </p>

        <h2>4. Links Externos</h2>
        <p>
          Podemos apontar caminhos para outros sites (parceiros, editais, referências). Uma vez que você sai do nosso território, os acordos de convivência de lá passam a valer.
        </p>

        <h2>5. Término da Travessia</h2>
        <p>
          Reservamo-nos o direito de restringir o acesso a áreas administrativas ou interativas deste site caso os acordos de convivência sejam rompidos.
        </p>

        <div className="mt-12 pt-8 border-t border-border/50 italic text-sm text-foreground/50">
          Última atualização: Maio de 2024.
        </div>
      </section>
    </>
  )
}
