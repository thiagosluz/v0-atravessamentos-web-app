"use client"

import * as React from "react"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { getNewsletterSubscribers, unsubscribeFromNewsletter } from "@/lib/actions/newsletter"
import { broadcastNews } from "@/lib/actions/broadcast"
import { NewsletterHeader } from "./panels/newsletter/newsletter-header"
import { SubscriberList } from "./panels/newsletter/subscriber-list"

export function NewsletterAdminPanel() {
  const [subscribers, setSubscribers] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [isBroadcasting, setIsBroadcasting] = React.useState(false)
  const { toast } = useToast()

  React.useEffect(() => {
    loadSubscribers()
  }, [])

  async function loadSubscribers() {
    setIsLoading(true)
    const res = await getNewsletterSubscribers()
    if (res.success) {
      setSubscribers(res.subscribers || [])
    } else {
      toast({ 
        title: "Erro ao carregar assinantes", 
        description: res.error, 
        variant: "destructive" 
      })
    }
    setIsLoading(false)
  }

  async function handleRemove(email: string) {
    if (confirm(`Remover ${email} da lista?`)) {
      const res = await unsubscribeFromNewsletter(email)
      if (res.success) {
        toast({ title: "Assinante removido" })
        loadSubscribers()
      } else {
        toast({ title: "Erro ao remover", description: res.error, variant: "destructive" })
      }
    }
  }

  async function handleBroadcast() {
    // Aqui poderíamos ter um modal para escolher o conteúdo, 
    // mas por enquanto vamos simular o disparo do último post se disponível
    // ou apenas abrir um diálogo de confirmação.
    
    if (!confirm("Deseja disparar o último conteúdo publicado para todos os assinantes?")) return

    setIsBroadcasting(true)
    // Exemplo de payload (na vida real viria de uma seleção)
    const res = await broadcastNews({
      title: "Novidades do Coletivo",
      excerpt: "Confira as últimas atualizações em nosso arquivo vivo.",
      category: "Geral",
      slug: "novidades",
    })

    if (res.success) {
      toast({ 
        title: "Broadcast concluído!", 
        description: `${res.count} e-mails foram processados.` 
      })
    } else {
      toast({ 
        title: "Erro no disparo", 
        description: res.error, 
        variant: "destructive" 
      })
    }
    setIsBroadcasting(false)
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary/40" />
        <p className="text-sm font-display italic text-foreground/50">Carregando lista de transmissão...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <NewsletterHeader 
        onBroadcast={handleBroadcast} 
        isBroadcasting={isBroadcasting} 
      />
      
      <SubscriberList 
        subscribers={subscribers} 
        onRemove={handleRemove} 
      />
    </div>
  )
}
