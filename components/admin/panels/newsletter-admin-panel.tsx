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
import { NewsletterHeader } from "./newsletter/newsletter-header"
import { SubscriberList } from "./newsletter/subscriber-list"
import { BroadcastHistory } from "./newsletter/broadcast-history"
import { cn } from "@/lib/utils"
import { useAsyncData } from "@/hooks/use-async-data"
import { Trash2, Send } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

type NewsletterTab = "subscribers" | "history"

export function NewsletterAdminPanel() {
  const [activeTab, setActiveTab] = React.useState<NewsletterTab>("subscribers")
  const [isBroadcasting, setIsBroadcasting] = React.useState(false)
  const [subscriberToRemove, setSubscriberToRemove] = React.useState<string | null>(null)
  const [showBroadcastConfirm, setShowBroadcastConfirm] = React.useState(false)
  const [historyPage, setHistoryPage] = React.useState(1)
  const historyLimit = 5
  const { toast } = useToast()

  // Uso do hook customizado useAsyncData para simplificar o fetch-and-state
  // O hook gerencia isLoading, error e refresh automaticamente
  const { 
    data: subscribers, 
    isLoading: loadingSubscribers, 
    refresh: refreshSubscribers 
  } = useAsyncData<NewsletterSubscriber[]>(
    getNewsletterSubscribers, 
    { immediate: activeTab === "subscribers" }
  )

  const fetchHistoryFn = React.useCallback(() => {
    return getBroadcastHistory(historyPage, historyLimit)
  }, [historyPage])

  const { 
    data: historyData, 
    isLoading: loadingHistory, 
    refresh: refreshHistory 
  } = useAsyncData<{ broadcasts: NewsletterBroadcast[]; totalCount: number }>(
    fetchHistoryFn, 
    { immediate: activeTab === "history" }
  )

  // Sincroniza o carregamento baseado na aba ativa ou na mudança de página do histórico
  React.useEffect(() => {
    if (activeTab === "subscribers" && !subscribers) refreshSubscribers()
    if (activeTab === "history" && !historyData) refreshHistory()
  }, [activeTab, subscribers, historyData, refreshSubscribers, refreshHistory, historyPage])

  const isLoading = activeTab === "subscribers" ? loadingSubscribers : loadingHistory

  async function handleRemove(email: string) {
    setSubscriberToRemove(email)
  }

  async function confirmRemove() {
    if (!subscriberToRemove) return
    const res = await unsubscribeFromNewsletter(subscriberToRemove)
    if (res.success) {
      toast({ title: "Assinante removido" })
      refreshSubscribers()
    }
    setSubscriberToRemove(null)
  }

  async function handleBroadcast() {
    setShowBroadcastConfirm(true)
  }

  async function confirmBroadcast() {
    setShowBroadcastConfirm(false)

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
      if (activeTab === "history") refreshHistory()
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
                : "text-foreground hover:text-foreground"
            )}
          >
            <Users className="h-4 w-4" />
            Assinantes
            <span className="ml-1 text-[10px] bg-primary/10 px-1.5 py-0.5 rounded-full">
              {subscribers?.length || 0}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all",
              activeTab === "history" 
                ? "bg-background shadow-lg shadow-black/5 text-primary" 
                : "text-foreground hover:text-foreground"
            )}
          >
            <HistoryIcon className="h-4 w-4" />
            Histórico
          </button>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary/40" />
            <p className="text-sm font-display italic text-foreground">Sincronizando dados...</p>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {activeTab === "subscribers" ? (
              <SubscriberList 
                subscribers={subscribers || []} 
                onRemove={handleRemove} 
              />
            ) : (
              <BroadcastHistory 
                history={historyData?.broadcasts || []} 
                currentPage={historyPage}
                totalCount={historyData?.totalCount || 0}
                limit={historyLimit}
                onPageChange={setHistoryPage}
              />
            )}
          </div>
        )}
      </div>

      {/* Modal de Remoção de Assinante */}
      <AlertDialog open={!!subscriberToRemove} onOpenChange={(open: boolean) => !open && setSubscriberToRemove(null)}>
        <AlertDialogContent className="rounded-[32px] border-none shadow-2xl p-8">
          <AlertDialogHeader>
            <div className="h-12 w-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-4">
              <Trash2 className="h-6 w-6" />
            </div>
            <AlertDialogTitle className="text-2xl font-display font-black uppercase italic tracking-tight">
              Remover Assinante
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base text-foreground">
              Tem certeza que deseja remover <strong>{subscriberToRemove}</strong> da lista de newsletter? 
              O usuário deixará de receber comunicações imediatamente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-8 gap-3">
            <AlertDialogCancel className="rounded-full border-none bg-muted hover:bg-muted/80 h-12 px-6 font-bold transition-all">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmRemove}
              className="rounded-full bg-red-600 hover:bg-red-700 text-white h-12 px-8 font-bold shadow-lg shadow-red-600/20 transition-all border-none"
            >
              Sim, Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modal de Confirmação de Broadcast */}
      <AlertDialog open={showBroadcastConfirm} onOpenChange={setShowBroadcastConfirm}>
        <AlertDialogContent className="rounded-[32px] border-none shadow-2xl p-8">
          <AlertDialogHeader>
            <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
              <Send className="h-6 w-6" />
            </div>
            <AlertDialogTitle className="text-2xl font-display font-black uppercase italic tracking-tight">
              Disparar Novidades
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base text-foreground">
              Deseja disparar o último conteúdo publicado para todos os <strong>{subscribers?.length || 0} assinantes</strong> agora?
              Esta ação enviará e-mails via Resend imediatamente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-8 gap-3">
            <AlertDialogCancel className="rounded-full border-none bg-muted hover:bg-muted/80 h-12 px-6 font-bold transition-all">
              Agora não
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmBroadcast}
              className="rounded-full bg-primary hover:bg-primary/90 text-white h-12 px-8 font-bold shadow-lg shadow-primary/20 transition-all border-none"
            >
              Sim, disparar agora
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
