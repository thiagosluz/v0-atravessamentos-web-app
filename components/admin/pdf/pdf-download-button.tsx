"use client"

import React, { useState } from "react"
import dynamic from "next/dynamic"
import { type Member, type Project } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { FileDown, Loader2 } from "lucide-react"
import { createBrowserClient } from "@supabase/ssr"

// Importação assíncrona do componente pesado do PDF.
// Ele só será baixado se o usuário clicar no botão e o estado "ready" for ativado!
const PDFDownloadEngine = dynamic(() => import("./pdf-download-engine"), {
  ssr: false,
  loading: () => (
    <Button disabled className="h-8 gap-1 rounded-full text-xs">
      <Loader2 className="h-3 w-3 animate-spin" />
      <span>Montando gerador...</span>
    </Button>
  ),
})

interface PDFDownloadButtonProps {
  member: Member
}

export function PDFDownloadButton({ member }: PDFDownloadButtonProps) {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(false)
  const [ready, setReady] = useState(false)

  const handlePreparePDF = async () => {
    setLoading(true)
    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      const { data } = await supabase
        .from("projects")
        .select("*")
        .contains("member_ids", [member.id])
        .order("year", { ascending: false })

      if (data) {
        setProjects(data as any)
      }
      
      // Ao setar como true, o React vai renderizar o <PDFDownloadEngine>
      // O next/dynamic então iniciará o download do JS pesado do react-pdf pela rede.
      setReady(true)
    } catch (error) {
      console.error("Erro ao preparar PDF:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!ready) {
    return (
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handlePreparePDF}
        disabled={loading}
        className="h-8 gap-1 rounded-full text-xs"
      >
        {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <FileDown className="h-3 w-3" />}
        <span>Gerar PDF</span>
      </Button>
    )
  }

  return <PDFDownloadEngine member={member} projects={projects} />
}
