"use client"

import React, { useState, useEffect } from "react"
import { PDFDownloadLink } from "@react-pdf/renderer"
import { MemberPortfolioPDF } from "./member-portfolio-pdf"
import { type Member, type Project } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { FileDown, Loader2 } from "lucide-react"
import { createBrowserClient } from "@supabase/ssr"

interface PDFDownloadButtonProps {
  member: Member
}

export function PDFDownloadButton({ member }: PDFDownloadButtonProps) {
  const [isClient, setIsClient] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

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
      setReady(true)
    } catch (error) {
      console.error("Erro ao preparar PDF:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!isClient) return null

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

  return (
    <PDFDownloadLink
      document={<MemberPortfolioPDF member={member} projects={projects} />}
      fileName={`portfolio_${member.name.toLowerCase().replace(/\\s+/g, "_")}.pdf`}
      className="inline-flex h-8 items-center justify-center gap-1 rounded-full border border-primary bg-primary px-3 text-xs font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
    >
      {({ blob, url, loading, error }) =>
        loading ? (
          <>
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>Gerando...</span>
          </>
        ) : (
          <>
            <FileDown className="h-3 w-3" />
            <span>Baixar PDF</span>
          </>
        )
      }
    </PDFDownloadLink>
  )
}
