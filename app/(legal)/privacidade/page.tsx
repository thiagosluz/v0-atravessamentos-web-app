import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacidade como Cuidado — Atravessamentos",
  description: "Entenda como cuidamos dos seus rastros e dados nesta travessia.",
}

export default function PrivacidadePage() {
  return (
    <>
      <header className="mb-12">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Transparência</span>
        <h1 className="mt-4 text-4xl md:text-5xl font-bold leading-tight">Privacidade como Cuidado</h1>
      </header>

      <section>
        <p>
          Para o Coletivo Atravessamentos, a privacidade não é apenas uma conformidade jurídica, mas uma extensão da nossa ética de <strong>afeto e cuidado</strong>. Entendemos que seus rastros digitais fazem parte da sua identidade e, nesta travessia, nos comprometemos a protegê-los.
        </p>

        <h2>O que coletamos e por quê</h2>
        <p>
          Coletamos o mínimo necessário para que o site funcione e para que possamos entender como as pessoas interagem com nossas pesquisas e artes.
        </p>
        <ul>
          <li><strong>Dados de Navegação:</strong> Informações anônimas (como páginas visitadas e tempo de permanência) coletadas para melhorar a experiência do site.</li>
          <li><strong>Cookies:</strong> Usamos pequenos arquivos para lembrar suas preferências. Você pode desativá-los nas configurações do seu navegador a qualquer momento.</li>
          <li><strong>Contatos:</strong> Se você nos enviar um e-mail ou mensagem, guardaremos esses dados apenas para responder à sua solicitação.</li>
        </ul>

        <h2>Seus direitos (LGPD)</h2>
        <p>
          Você é dono da sua história. De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem o direito de:
        </p>
        <ul>
          <li>Confirmar se tratamos seus dados.</li>
          <li>Acessar seus dados que estão conosco.</li>
          <li>Solicitar a correção de dados incompletos ou desatualizados.</li>
          <li>Pedir a exclusão definitiva de seus dados de nossa base.</li>
        </ul>

        <h2>Segurança</h2>
        <p>
          Empregamos medidas técnicas para proteger suas informações contra acessos não autorizados ou situações acidentais de destruição, perda ou alteração. Nossa infraestrutura utiliza criptografia de ponta e práticas seguras de desenvolvimento.
        </p>

        <h2>Alterações</h2>
        <p>
          Esta política pode ser atravessada por novas atualizações. Quando isso acontecer, as mudanças serão publicadas aqui.
        </p>

        <div className="mt-12 pt-8 border-t border-border/50 italic text-sm text-foreground/50">
          Última atualização: Maio de 2024.
        </div>
      </section>
    </>
  )
}
