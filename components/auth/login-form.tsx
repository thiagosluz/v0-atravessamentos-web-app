"use client"

import * as React from "react"
import { motion } from "motion/react"
import { signIn } from "@/lib/actions/auth"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ArrowRight, Eye, EyeOff, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

export function LoginForm() {
  const [pending, setPending] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [showPassword, setShowPassword] = React.useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const result = await signIn(formData)

    if (result?.error) {
      setError(result.error)
      setPending(false)
    }
    // If no error, the server action redirects to /admin
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Email */}
      <div className="space-y-2">
        <label
          htmlFor="login-email"
          className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/60"
        >
          E-mail
        </label>
        <Input
          id="login-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="sua@email.com"
          disabled={pending}
          className="h-12 rounded-none border-0 border-b-2 border-foreground/20 bg-transparent px-0 text-base placeholder:text-foreground/30 focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors"
        />
      </div>

      {/* Password */}
      <div className="space-y-2">
        <label
          htmlFor="login-password"
          className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/60"
        >
          Senha
        </label>
        <div className="relative">
          <Input
            id="login-password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            autoComplete="current-password"
            placeholder="••••••••"
            disabled={pending}
            className="h-12 rounded-none border-0 border-b-2 border-foreground/20 bg-transparent px-0 pr-10 text-base placeholder:text-foreground/30 focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-0 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground transition-colors"
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-destructive"
          role="alert"
        >
          {error}
        </motion.p>
      )}

      {/* Submit */}
      <div className="pt-4">
        <Button
          type="submit"
          disabled={pending}
          className={cn(
            "group h-14 w-full rounded-none bg-foreground text-background text-base font-semibold tracking-tight transition-all hover:bg-primary",
            pending && "opacity-60 cursor-not-allowed",
          )}
        >
          {pending ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-background/30 border-t-background" />
              Entrando…
            </span>
          ) : (
            <span className="flex items-center gap-2">
              Entrar no painel
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          )}
        </Button>
      </div>

      {/* Back link */}
      <p className="pt-2 text-center text-xs text-foreground/50">
        <a href="/" className="underline underline-offset-4 hover:text-foreground transition-colors">
          ← Voltar ao site
        </a>
      </p>
    </form>
  )
}
