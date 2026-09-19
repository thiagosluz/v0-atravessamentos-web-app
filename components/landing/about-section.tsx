"use client"

import { motion } from "motion/react"
import { OrganicImage } from "@/components/ui/organic-image"
import { type SiteSettings } from "@/lib/actions/settings"

export function AboutSection({ settings }: { settings?: SiteSettings }) {
  return (
    <section id="sobre" className="relative scroll-mt-24 py-20 md:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 md:grid-cols-12 md:gap-16 md:px-8">
        {/* Left: manifesto text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="md:col-span-7"
        >
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            <span className="h-px w-8 bg-primary" />
            Sobre o coletivo
          </span>
          <h2 className="mt-6 font-display text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl text-balance">
            Habitar as <span className="italic font-light">frestas</span>, romper as fronteiras.
          </h2>

          <div className="mt-10 space-y-6 text-lg leading-relaxed text-foreground md:text-xl">
            <p>
              O <strong className="font-semibold text-foreground">Coletivo Atravessamentos</strong> nasceu de gente indignada.
              <br />
              De gente insubordinada.
              <br />
              De gente cansada de assistir às injustiças e seguir como se nada tivesse acontecido.
            </p>

            <p>
              Antes de existir um coletivo, existia uma pergunta que nos atravessava:{" "}
              <strong className="font-semibold text-foreground">
                o que fazer com toda essa indignação?
              </strong>
            </p>

            <p>
              O que fazer com aquilo que incomoda, revolta, inquieta e não nos permite simplesmente aceitar o mundo como ele está? Como transformar a indignação em movimento sem precisar caber nos lugares que já estavam dados? Como construir alguma coisa sem reproduzir as mesmas hierarquias, silenciamentos e formas de poder que tanto nos incomodavam?
            </p>

            <p>
              Foi desse incômodo que, em junho de 2022, em Jataí, no interior de Goiás, começamos a nos encontrar.
            </p>

            <p>
              E talvez o Atravessamentos tenha começado justamente aí: quando percebemos que não precisávamos responder sozinhos àquela pergunta.
            </p>

            <p>
              Encontramos na{" "}
              <strong className="font-semibold text-foreground">
                educação popular, na arte e na produção cultural
              </strong>{" "}
              maneiras de transformar inquietação em criação. Fizemos rodas, oficinas, exposições, filmes, formações, intervenções. Ocupamos espaços, inventamos outros. Aprendemos que uma câmera, um tear, uma conversa, um desenho, uma sala de aula, uma parede ocupada por obras ou uma roda de pessoas podem ser lugares de produção de conhecimento, de memória, de resistência e de transformação.
            </p>

            <p>
              Mas o Atravessamentos nunca foi somente aquilo que fazemos.
            </p>

            <p>
              É, sobretudo,{" "}
              <strong className="font-semibold text-foreground">
                um lugar onde podemos ser
              </strong>
              .
            </p>

            <p>
              Queríamos nos{" "}
              <strong className="font-semibold text-foreground">
                desinstitucionalizar
              </strong>
              .
            </p>

            <p>
              Ou, talvez, inventar nossas próprias formas de institucionalidade.
            </p>

            <p>
              Desde 2022, muita coisa nos atravessou. E nós também atravessamos muitos lugares, pessoas e histórias. O coletivo tornou-se movimento; e hoje somos também{" "}
              <strong className="font-semibold text-foreground">
                Ponto de Cultura da Rede Cultura Viva
              </strong>
              .
            </p>

            <p>
              Ainda assim, aquela pergunta permanece conosco.
            </p>

            <p className="pt-2 font-display text-2xl font-bold md:text-3xl text-foreground">
              <strong>O que fazemos com a nossa indignação?</strong>
            </p>

            <div className="space-y-1">
              <p>Criamos.</p>
              <p>E fazemos isso juntos.</p>
              <p>Sem deixar de ser quem somos.</p>
            </div>

            <div className="space-y-2 pt-4 border-t border-foreground/15">
              <p className="font-display text-xl font-bold leading-snug md:text-2xl text-foreground">
                <strong>Somos gente atravessada pelo mundo e disposta a atravessá-lo de volta.</strong>
              </p>
              <p className="font-display text-2xl font-bold tracking-tight md:text-3xl text-primary">
                <strong>Somos Atravessamentos.</strong>
              </p>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-4 max-w-md">
            {settings?.stats_years && (
              <Stat number={settings.stats_years} label="anos de travessia" />
            )}
            {settings?.stats_projects && (
              <Stat number={settings.stats_projects} label="projetos realizados" />
            )}
            {settings?.stats_cities && (
              <Stat number={settings.stats_cities} label="cidades alcançadas" />
            )}
          </div>

          <div className="mt-12 p-6 rounded-2xl border border-primary/20 bg-primary/5 flex flex-col sm:flex-row items-center gap-6 max-w-xl">
            <div className="flex gap-4 shrink-0">
              <a
                href="https://culturaviva.cultura.gov.br/certificado/143514/"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform hover:scale-105"
              >
                <img
                  src="/images/selo-ponto-cultura.png"
                  alt="Selo Ponto de Cultura"
                  className="h-16 w-16 object-contain"
                />
              </a>
              <a
                href="https://culturaviva.cultura.gov.br/certificado/143513/"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform hover:scale-105"
              >
                <img
                  src="/images/selo-edital-minc.png"
                  alt="Selo Certificação Via Edital MinC"
                  className="h-16 w-16 object-contain"
                />
              </a>
            </div>
            <div className="space-y-2 text-center sm:text-left">
              <h3 className="font-display font-bold text-lg leading-tight text-foreground">
                Ponto de Cultura Certificado
              </h3>
              <p className="text-sm text-foreground/80 leading-normal">
                O Coletivo Atravessamentos é reconhecido pelo Ministério da Cultura como Ponto de Cultura (ID 13233982) sob a rede Cultura Viva.
              </p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-x-4 gap-y-1 pt-1">
                <a
                  href="https://culturaviva.cultura.gov.br/agente/13233982/#info"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  Ver Perfil de Agente
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right: collage grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="md:col-span-5 md:sticky md:top-28 md:self-start h-[520px] md:h-[640px] lg:h-[720px]"
        >
          <div className="grid h-full grid-cols-6 gap-3 md:gap-4">
            <div className="col-span-4 row-span-2">
              <OrganicImage
                src={settings?.about_images?.[0] || ""}
                fallbackSrc="/images/landing/about-1.png"
                alt="Encontro do coletivo em roda"
                shape="organic"
                overlayColor="primary"
                sizes="(max-width: 768px) 66vw, 40vw"
              />
            </div>
            <div className="col-span-2">
              <OrganicImage
                src={settings?.about_images?.[1] || ""}
                fallbackSrc="/images/landing/about-2.png"
                alt="Mãos pintando uma obra coletiva"
                shape="rounded-3xl"
                overlayColor="accent"
                overlayOpacity={0.2}
                sizes="(max-width: 768px) 33vw, 20vw"
              />
            </div>
            <div className="col-span-2">
              <OrganicImage
                src={settings?.about_images?.[2] || ""}
                fallbackSrc="/images/landing/about-3.png"
                alt="Máquina de escrever com texto manifestário"
                shape="rounded-custom"
                overlayColor="ouro"
                overlayOpacity={0.3}
                sizes="(max-width: 768px) 33vw, 20vw"
              />
            </div>
            <div className="col-span-3">
              <OrganicImage
                src={settings?.about_images?.[3] || ""}
                fallbackSrc="/images/landing/about-4.png"
                alt="Marcha de protesto com cartazes"
                shape="organic-3"
                overlayColor="primary"
                overlayOpacity={0.1}
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
            <div className="col-span-3">
              <OrganicImage
                src={settings?.about_images?.[4] || ""}
                fallbackSrc="/images/landing/about-5.png"
                alt="Câmera de cinema em set de filmagem"
                shape="rounded-3xl"
                overlayColor="foreground"
                overlayOpacity={0.05}
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div className="border-t-2 border-foreground/20 pt-3">
      <div className="font-display text-3xl font-bold tracking-tight md:text-4xl">{number}</div>
      <div className="mt-1 text-xs leading-tight text-foreground">{label}</div>
    </div>
  )
}
