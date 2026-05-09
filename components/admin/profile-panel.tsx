"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { updateProfile } from "@/lib/actions/auth"

export function ProfilePanel({ user }: { user: any }) {
  const { toast } = useToast()
  const [pending, setPending] = React.useState(false)

  const currentName = user?.user_metadata?.full_name || ""
  const currentEmail = user?.email || ""

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)

    const formData = new FormData(e.currentTarget)
    
    // Only send fields that were actually changed to avoid triggering unnecessary validations
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    
    const finalFormData = new FormData()
    if (name && name !== currentName) finalFormData.append("name", name)
    if (email && email !== currentEmail) finalFormData.append("email", email)
    if (password) finalFormData.append("password", password)

    // Only make request if there's something to update
    let result: { error?: string; success?: boolean } = { success: false }
    if (Array.from(finalFormData.keys()).length > 0) {
      result = await updateProfile(finalFormData)
    } else {
      setPending(false)
      return
    }

    setPending(false)

    if (result.error) {
      toast({ title: "Erro ao salvar", description: result.error, variant: "destructive" })
      return
    }

    toast({ 
      title: "Perfil atualizado", 
      description: email && email !== currentEmail 
        ? "Dados salvos. Se você alterou o e-mail, verifique sua caixa de entrada para confirmar o novo endereço." 
        : "Seus dados foram atualizados com sucesso." 
    })
    
    // Clear password field
    const form = e.target as HTMLFormElement
    const passwordInput = form.elements.namedItem("password") as HTMLInputElement
    if (passwordInput) passwordInput.value = ""
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8 mt-6">
      <div className="flex flex-col gap-4 border-b border-border p-4 md:p-6 bg-card rounded-2xl border">
        <div>
          <h2 className="font-display text-lg font-bold tracking-tight md:text-xl">
            Seu Perfil
          </h2>
          <p className="mt-1 text-sm text-foreground/65">
            Atualize suas credenciais e informações pessoais.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nome completo</Label>
            <Input 
              id="name" 
              name="name" 
              defaultValue={currentName} 
              placeholder="Ex: Aline Sá" 
              disabled={pending} 
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">E-mail de acesso</Label>
            <Input 
              id="email" 
              name="email" 
              type="email"
              defaultValue={currentEmail} 
              disabled={pending} 
            />
            <p className="text-xs text-foreground/60">
              Se alterar o e-mail, um link de confirmação será enviado para o novo endereço.
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Nova Senha</Label>
            <Input 
              id="password" 
              name="password" 
              type="password"
              placeholder="Deixe em branco para não alterar" 
              disabled={pending} 
              minLength={6}
            />
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={pending}>
              {pending ? "Salvando..." : "Salvar alterações"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
