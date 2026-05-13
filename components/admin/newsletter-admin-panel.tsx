"use client"

import * as React from "react"
import { Loader2, Users, History as HistoryIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { 
  getNewsletterSubscribers, 
  unsubscribeFromNewsletter, 
  getBroadcastHistory 
} from "@/lib/actions/newsletter"
import { broadcastNews } from "@/lib/actions/broadcast"
import { type NewsletterSubscriber, type NewsletterBroadcast } from "@/types/admin"
import { NewsletterHeader } from "./panels/newsletter/newsletter-header"
import { SubscriberList } from "./panels/newsletter/subscriber-list"
import { BroadcastHistory } from "./panels/newsletter/broadcast-history"
import { cn } from "@/lib/utils"

type NewsletterTab = "subscribers" | "history"

export function NewsletterAdminPanel() {
  const [activeTab, setActiveTab] = React.useState<NewsletterTab>("subscribers")
  const [subscribers, setSubscribers] = React.useState<NewsletterSubscriber[]>([])
  const [history, setHistory] = React.useState<NewsletterBroadcast[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [isBroadcasting, setIsBroadcasting] = React.useState(false)
  const { toast } = useToast()

  React.useEffect(() => {
    loadData()
  }, [activeTab])

  async function loadData() {
    setIsLoading(true)
    if (activeTab === "subscribers") {
      const res = await getNewsletterSubscribers()
      if (res.success) {
        setSubscribers(res.data || [])
      } else {
        toast({ title: "Erro ao carregar assinantes", description: res.error, variant: "destructive" })
      }
    } else {
      const res = await getBroadcastHistory()
      if (res.success) {
        setHistory(res.data || [])
      } else {
        toast({ title: "Erro ao carregar histórico", description: res.error, variant: "destructive" })
      }
    }
    setIsLoading(false)
  }

  async function handleRemove(email: string) {
    if (confirm(`Remover ${email} da lista?`)) {
      const res = await unsubscribeFromNewsletter(email)
      if (res.success) {
        toast({ title: "Assinante removido" })
        loadData()
      } else {
        toast({ title: "Erro ao remover", description: res.error, variant: "destructive" })
      }
    }
  }

  async function handleBroadcast() {
    if (!confirm("Deseja disparar o último conteúdo publicado para todos os assinantes?")) return

    setIsBroadcasting(true)
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
      if (activeTab === "history") loadData()
    } else {
      toast({ title: "Erro no disparo", description: res.error, variant: "destructive" })
    }
    setIsBroadcasting(false)
  }

  return (
    <div className="flex flex-col">
      <NewsletterHeader 
        onBroadcast={handleBroadcast} 
        isBroadcasting={isBroadcasting} 
      />

      <div className="px-6 md:px-10 pb-10">
        {/* Tab Switcher */}
        <div className="flex gap-4 p-1 bg-muted/30 rounded-2xl w-fit mb-8 border">
          <button
            onClick={() => setActiveTab("subscribers")}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all",
              activeTab === "subscribers" 
                ? "bg-background shadow-lg shadow-black/5 text-primary" 
                : "text-foreground/40 hover:text-foreground/60"
            )}
          >
            <Users className="h-4 w-4" />
            Assinantes
            <span className="ml-1 text-[10px] bg-primary/10 px-1.5 py-0.5 rounded-full">
              {subscribers.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all",
              activeTab === "history" 
                ? "bg-background shadow-lg shadow-black/5 text-primary" 
                : "text-foreground/40 hover:text-foreground/60"
            )}
          >
            <HistoryIcon className="h-4 w-4" />
            Histórico
          </button>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary/40" />
            <p className="text-sm font-display italic text-foreground/50">Sincronizando dados...</p>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {activeTab === "subscribers" ? (
              <SubscriberList 
                subscribers={subscribers} 
                onRemove={handleRemove} 
              />
            ) : (
              <BroadcastHistory history={history} />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
