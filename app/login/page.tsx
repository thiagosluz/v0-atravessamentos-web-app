import { getSession } from "@/lib/actions/auth"
import { redirect } from "next/navigation"
import { LoginForm } from "@/components/auth/login-form"
import { Sparkles } from "lucide-react"

export const metadata = {
  title: "Entrar — Atravessamentos",
  description: "Acesso restrito ao painel administrativo do Coletivo Atravessamentos.",
  robots: "noindex, nofollow",
}

export default async function LoginPage() {
  // If already logged in, go directly to admin
  const user = await getSession()
  if (user) redirect("/admin")

  return (
    <div className="relative isolate min-h-screen overflow-hidden">
      {/* Background grain texture dots */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-background"
      />

      <div className="grid min-h-screen lg:grid-cols-[1fr_520px]">

        {/* === LEFT: Manifesto visual === */}
        <div className="relative hidden flex-col justify-between overflow-hidden bg-foreground p-12 text-background lg:flex xl:p-16">
          {/* Decorative organic shape */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 bg-primary/40 border-organic blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-32 -right-16 h-80 w-80 bg-[var(--musgo)]/30 border-organic-2 blur-3xl"
          />

          {/* Logo */}
          <a href="/" className="relative z-10 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center bg-primary border-organic">
              <span className="font-display text-xl font-bold leading-none text-primary-foreground">A</span>
            </span>
            <span className="font-display text-lg font-bold tracking-tight">
              Atravessamentos
            </span>
          </a>

          {/* Massive typographic statement */}
          <div className="relative z-10 space-y-8">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-background/50">
              Área restrita · Membros do coletivo
            </p>
            <h1 className="font-display text-[clamp(3.5rem,8vw,6rem)] font-bold leading-[0.88] tracking-[-0.04em] text-balance">
              Quem
              <span className="block italic font-light text-primary">entra</span>
              constrói.
            </h1>
            <p className="max-w-sm text-base text-background/65 leading-relaxed">
              O painel administrativo é o espaço de criação e gestão das ações do coletivo. Acesse com suas credenciais.
            </p>
          </div>

          {/* Bottom caption */}
          <div className="relative z-10 flex items-center gap-2 text-xs text-background/40">
            <Sparkles className="h-3.5 w-3.5 text-[var(--ouro)]" />
            <span>Jataí — GO · Cerrado · Decolonialidade</span>
          </div>
        </div>

        {/* === RIGHT: Form === */}
        <div className="flex flex-col items-center justify-center px-8 py-16 sm:px-12">
          {/* Mobile logo */}
          <div className="mb-10 lg:hidden">
            <a href="/" className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center bg-foreground border-organic">
                <span className="font-display text-xl font-bold leading-none text-background">A</span>
              </span>
              <span className="font-display text-lg font-bold tracking-tight">
                atravessamentos
              </span>
            </a>
          </div>

          <div className="w-full max-w-sm">
            <div className="mb-10">
              <h2 className="font-display text-3xl font-bold tracking-tight">
                Bem-vinde de volta
              </h2>
              <p className="mt-2 text-sm text-foreground">
                Use seu e-mail e senha de acesso ao painel.
              </p>
            </div>

            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  )
}
