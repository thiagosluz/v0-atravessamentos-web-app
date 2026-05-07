"use client"

import * as React from "react"
import {
  Clock,
  AlertCircle,
  ArrowRight,
  FileText,
  FolderKanban,
  Users,
  PieChart as PieChartIcon,
  Sparkles
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip
} from "recharts"

interface OverviewPanelProps {
  user: any
  projects: any[]
  blogPosts: any[]
  members: any[]
  setActive: (id: string) => void
}

const COLORS = ["#8B9D83", "#C5A059", "#D97D54", "#4A5D4E", "#7D6B4A"]

export function OverviewPanel({ user, projects, blogPosts, members, setActive }: OverviewPanelProps) {
  const [isMac, setIsMac] = React.useState(true)

  React.useEffect(() => {
    // Detecta se o SO é Mac para ajustar a exibição do atalho
    if (typeof window !== "undefined" && navigator) {
      setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0)
    }
  }, [])

  const userName = user?.user_metadata?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "Administrador"

  // Função auxiliar para normalizar a data de cada tipo de item
  const getItemDate = (item: any) => {
    const dateStr = item.updatedAt || item.date || item.createdAt || item.updated_at || item.created_at
    const date = new Date(dateStr)
    return isNaN(date.getTime()) ? new Date(0) : date
  }

  // Combinar e ordenar atividades recentes
  const recentActivity = React.useMemo(() => {
    const p = projects.map(item => ({ ...item, type: 'project' }))
    const b = blogPosts.map(item => ({ ...item, type: 'blog' }))
    const m = members.map(item => ({ ...item, type: 'member' }))

    return [...p, ...b, ...m]
      .sort((a, b) => getItemDate(b).getTime() - getItemDate(a).getTime())
      .slice(0, 5)
  }, [projects, blogPosts, members])

  // Itens que precisam de atenção (Rascunhos ou Em Revisão)
  const pendingItems = React.useMemo(() => {
    const p = projects.filter(item => item.status !== 'Publicado').map(item => ({ ...item, type: 'project' }))
    const b = blogPosts.filter(item => item.status !== 'Publicado').map(item => ({ ...item, type: 'blog' }))

    return [...p, ...b]
      .sort((a, b) => getItemDate(b).getTime() - getItemDate(a).getTime())
      .slice(0, 4)
  }, [projects, blogPosts])

  // Dados para o gráfico de rosca (Distribuição por categoria de projeto)
  const chartData = React.useMemo(() => {
    const counts: Record<string, number> = {}
    projects.forEach(p => {
      counts[p.category] = (counts[p.category] || 0) + 1
    })
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  }, [projects])

  const newItemsCount = React.useMemo(() => {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const newProjects = projects.filter(p => getItemDate(p) > thirtyDaysAgo).length
    const newPosts = blogPosts.filter(b => getItemDate(b) > thirtyDaysAgo).length

    return newProjects + newPosts
  }, [projects, blogPosts])

  return (
    <div className="space-y-8 p-4 md:p-6">
      {/* Banner de Boas-Vindas */}
      <div className="relative overflow-hidden rounded-3xl bg-foreground p-8 text-background">
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-sm font-medium text-background/60">
            <Sparkles className="h-4 w-4 text-[var(--ouro)]" />
            Visão Geral do Coletivo
          </div>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight md:text-4xl">
            Olá, {userName}!
          </h2>
          <p className="mt-2 max-w-xl text-background/70">
            Temos <span className="font-bold text-background">{newItemsCount} novas atualizações</span> nos últimos 30 dias.
          </p>
        </div>
        {/* Elementos decorativos */}
        <div className="absolute -right-8 -top-8 h-48 w-48 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-12 right-12 h-32 w-32 rounded-full bg-[var(--ouro)]/10 blur-2xl" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Coluna Principal: Atividades Recentes */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="border-b border-border p-5 flex items-center justify-between bg-muted/20">
              <h3 className="font-display font-bold flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                Últimas Atualizações
              </h3>
            </div>
            <div className="divide-y divide-border">
              {recentActivity.length > 0 ? (
                recentActivity.map((item) => (
                  <div key={`${item.type}-${item.id}`} className="p-4 flex items-center gap-4 hover:bg-muted/30 transition-colors">
                    <div className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                      item.type === 'project' ? "bg-blue-500/10 text-blue-500" :
                        item.type === 'blog' ? "bg-amber-500/10 text-amber-500" :
                          "bg-emerald-500/10 text-emerald-500"
                    )}>
                      {item.type === 'project' ? <FolderKanban className="h-5 w-5" /> :
                        item.type === 'blog' ? <FileText className="h-5 w-5" /> :
                          <Users className="h-5 w-5" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate text-sm text-foreground">
                        {item.title || item.name}
                      </p>
                      <p className="text-xs text-foreground/50">
                        {item.type === 'project' ? 'Projeto' : item.type === 'blog' ? 'Blog' : 'Membro'} •
                        {getItemDate(item).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                      </p>
                    </div>
                    <div className="hidden sm:block">
                      <span className={cn(
                        "px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase",
                        item.status === 'Publicado' ? "bg-emerald-500/10 text-emerald-600" :
                          item.status === 'Em revisão' ? "bg-orange-500/10 text-orange-600" :
                            "bg-muted text-muted-foreground"
                      )}>
                        {item.status || 'Ativo'}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center text-sm text-muted-foreground">
                  Nenhuma atividade recente encontrada.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Coluna Lateral */}
        <div className="space-y-6">
          {/* Donut Chart: Distribuição */}
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="border-b border-border p-5 flex items-center gap-2 bg-muted/20">
              <PieChartIcon className="h-4 w-4 text-primary" />
              <h3 className="font-display font-bold text-sm">Temas dos Projetos</h3>
            </div>
            <div className="p-4">
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        borderColor: "var(--border)",
                        borderRadius: "8px",
                        fontSize: "12px"
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2">
                {chartData.map((item, index) => (
                  <div key={item.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                      <span className="text-foreground/70">{item.name}</span>
                    </div>
                    <span className="font-bold">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Precisa de Atenção */}
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="border-b border-border p-5 flex items-center gap-2 bg-muted/20">
              <AlertCircle className="h-4 w-4 text-orange-500" />
              <h3 className="font-display font-bold text-sm">Pendentes</h3>
            </div>
            <div className="p-2 space-y-1">
              {pendingItems.length > 0 ? (
                pendingItems.map((item) => (
                  <button
                    key={`pending-${item.id}`}
                    className="w-full text-left p-3 rounded-xl hover:bg-muted/50 transition-colors flex items-center justify-between group"
                    onClick={() => setActive(item.type === 'project' ? 'projects' : 'blog')}
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate text-foreground">{item.title}</p>
                      <p className="text-[10px] text-orange-600 font-bold uppercase tracking-wider mt-0.5">
                        {item.status === 'Rascunho' ? 'Rascunho' : 'Em Revisão'}
                      </p>
                    </div>
                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                  </button>
                ))
              ) : (
                <div className="p-8 text-center text-xs text-muted-foreground italic">
                  Tudo publicado! 🎉
                </div>
              )}
            </div>
          </div>

          {/* Dica de Produtividade */}
          <div className="rounded-2xl bg-primary/5 border border-primary/10 p-5 relative overflow-hidden group">
            <div className="relative z-10">
              <h4 className="font-display font-bold text-primary text-sm mb-2 flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5" />
                Dica Pro
              </h4>
              <p className="text-xs text-primary/80 leading-relaxed">
                Use <kbd className="px-1.5 py-0.5 rounded bg-primary/10 border border-primary/20 font-mono text-[10px] text-primary font-bold">{isMac ? "Cmd+K" : "Ctrl+K"}</kbd> para buscar ou mudar de aba instantaneamente.
              </p>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Sparkles className="h-16 w-16 text-primary" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
