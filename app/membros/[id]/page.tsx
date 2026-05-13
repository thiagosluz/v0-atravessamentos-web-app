import { getMemberById, getMemberIds } from "@/lib/actions/members"
import { notFound } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { getSiteSettings } from "@/lib/actions/settings"
import Link from "next/link"
import { ArrowLeft, Instagram, Linkedin, Mail, Phone, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatDate } from "@/lib/mock-data"
import { SafeHTML } from "@/components/safe-html"

const tagColors: Record<string, string> = {
  Educadoras: "bg-[var(--terracota)]/15 text-[var(--terracota)] border-[var(--terracota)]/30",
  Artistas: "bg-[var(--musgo)]/15 text-[var(--musgo)] border-[var(--musgo)]/30",
  Pesquisadoras: "bg-[var(--mostarda)]/20 text-[var(--mostarda-dark)] border-[var(--mostarda)]/40",
}

export async function generateStaticParams() {
  const ids = await getMemberIds()
  return ids.map((id) => ({ id }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const data = await getMemberById(id)
  if (!data) return { title: "Membro não encontrado" }
  return { title: `${data.member.name} | Coletivo Atravessamentos` }
}

export default async function MemberPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [data, settings] = await Promise.all([
    getMemberById(id),
    getSiteSettings(),
  ])

  if (!data) {
    notFound()
  }

  const { member, relatedPosts } = data

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1 pb-24 pt-32">
        <div className="mx-auto max-w-4xl px-4 md:px-8">
          {/* Back button */}
          <Link
            href="/#quem-somos"
            className="mb-12 inline-flex items-center text-sm font-medium text-foreground/60 transition-colors hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Quem Somos
          </Link>

          {/* Member Profile */}
          <div className="grid gap-12 md:grid-cols-[1fr_2fr]">
            {/* Avatar & Social */}
            <div className="space-y-6">
              <div className="aspect-[4/5] w-full overflow-hidden rounded-[2rem] rounded-tr-none bg-muted">
                <img
                  src={member.avatar || "/placeholder.svg"}
                  alt={member.name}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Social Links */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-foreground/50">Contato</h3>
                <div className="flex flex-col gap-3">
                  {member.instagram && (
                    <a href={`https://instagram.com/${member.instagram.replace('@', '')}`} target="_blank" rel="noreferrer" className="inline-flex items-center text-sm font-medium text-foreground/80 hover:text-foreground">
                      <Instagram className="mr-2 h-4 w-4" />
                      {member.instagram}
                    </a>
                  )}
                  {member.linkedin && (
                    <a href={member.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center text-sm font-medium text-foreground/80 hover:text-foreground">
                      <Linkedin className="mr-2 h-4 w-4" />
                      LinkedIn
                    </a>
                  )}
                  {member.lattes_url && (
                    <a href={member.lattes_url} target="_blank" rel="noreferrer" className="inline-flex items-center text-sm font-medium text-foreground/80 hover:text-foreground">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Currículo Lattes
                    </a>
                  )}
                  {member.email && (
                    <a href={`mailto:${member.email}`} className="inline-flex items-center text-sm font-medium text-foreground/80 hover:text-foreground">
                      <Mail className="mr-2 h-4 w-4" />
                      {member.email}
                    </a>
                  )}
                  {member.phone && (
                    <a href={`tel:${member.phone.replace(/\\D/g, '')}`} className="inline-flex items-center text-sm font-medium text-foreground/80 hover:text-foreground">
                      <Phone className="mr-2 h-4 w-4" />
                      {member.phone}
                    </a>
                  )}
                  {!member.instagram && !member.linkedin && !member.lattes_url && !member.email && !member.phone && (
                    <p className="text-sm text-foreground/50">Nenhum contato público disponível.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="flex flex-col pt-4">
              <div className="mb-6 flex flex-wrap gap-2">
                {member.tags.map((tag) => (
                  <span
                    key={tag}
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs font-medium",
                      tagColors[tag] || "border-foreground/20 text-foreground/70",
                    )}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              
              <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                {member.name}
              </h1>
              <p className="mt-4 text-xl text-foreground/60 md:text-2xl">
                {member.role}
              </p>

              <SafeHTML 
                content={member.bio}
                className="mt-8 prose prose-neutral max-w-none text-foreground/80 leading-relaxed md:prose-lg"
              />

              {/* Related Posts */}
              {relatedPosts.length > 0 && (
                <div className="mt-16 border-t border-border pt-12">
                  <h2 className="mb-6 font-display text-2xl font-bold tracking-tight">
                    Textos de {member.name.split(' ')[0]}
                  </h2>
                  <div className="grid gap-6 sm:grid-cols-2">
                    {relatedPosts.map((post: any) => (
                      <Link key={post.id} href={`/diario/${post.slug}`} className="group block space-y-3">
                        <div className="aspect-[16/9] overflow-hidden rounded-xl bg-muted">
                          <img src={post.coverImage || "/placeholder.svg"} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        </div>
                        <div>
                          <p className="text-xs text-foreground/50">{formatDate(post.date)} · {post.category}</p>
                          <h3 className="mt-1 font-display text-lg font-bold leading-tight group-hover:underline">{post.title}</h3>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <SiteFooter settings={settings} />
    </div>
  )
}
