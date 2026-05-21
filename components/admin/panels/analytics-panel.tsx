"use client"

import React, { useEffect, useState } from "react"
import { getAnalyticsData } from "@/lib/actions/analytics"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Activity, Heart, TrendingUp } from "lucide-react"

export function AnalyticsPanel() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [totalLikes, setTotalLikes] = useState(0)
  const [trending, setTrending] = useState("Carregando...")
  const [period, setPeriod] = useState<"7" | "15" | "30" | "all">("7")

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        const result = await getAnalyticsData(period)
        if (result.success && result.chartData) {
          setData(result.chartData)
          setTotalLikes(result.totalRecentLikes || 0)
          setTrending(result.trendingName || "Nenhum dado")
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [period])

  if (loading && data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="font-display text-3xl font-black uppercase italic tracking-tighter">
            Radar do Coletivo
          </h2>
          <p className="text-muted-foreground">
            Máquina do tempo de engajamento do Acervo.
          </p>
        </div>
        
        <Select value={period} onValueChange={(v: any) => setPeriod(v)}>
          <SelectTrigger className="w-[180px] rounded-xl bg-white">
            <SelectValue placeholder="Selecione o período" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="7">Últimos 7 dias</SelectItem>
            <SelectItem value="15">Últimos 15 dias</SelectItem>
            <SelectItem value="30">Últimos 30 dias</SelectItem>
            <SelectItem value="all">Todo o período</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-[32px] border-none shadow-xl shadow-black/5 bg-gradient-to-br from-primary/10 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Interações ({period === 'all' ? 'Total' : `${period}d`})
            </CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black font-display">{totalLikes}</div>
            <p className="text-xs text-muted-foreground mt-1">Curtidas e engajamento registrados</p>
          </CardContent>
        </Card>

        <Card className="rounded-[32px] border-none shadow-xl shadow-black/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Obra em Alta</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold font-display text-[#333] truncate pr-2" title={trending}>{trending}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Mais curtida {period === 'all' ? 'de todas' : 'neste período'}
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-[32px] border-none shadow-xl shadow-black/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Status da Máquina</CardTitle>
            <Heart className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-display text-[#333]">Online</div>
            <p className="text-xs text-muted-foreground mt-1">Gravação de Redis p/ Supabase ativa</p>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-[40px] border-none shadow-2xl shadow-black/5 overflow-hidden">
        <CardHeader className="p-8 pb-4">
          <CardTitle className="font-display text-xl uppercase tracking-widest font-black">
            Curva de Engajamento
          </CardTitle>
          <CardDescription>Visualização diária de curtidas orgânicas.</CardDescription>
        </CardHeader>
        <CardContent className="p-8 pt-0">
          <div className="h-[350px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              {loading ? (
                <div className="h-full w-full flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary/40" />
                </div>
              ) : (
                <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorLikes" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#A65A3C" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#A65A3C" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#6B7280' }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#6B7280' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '16px', 
                      border: 'none', 
                      boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)' 
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="likes" 
                    name="Curtidas"
                    stroke="#A65A3C" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorLikes)" 
                  />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
