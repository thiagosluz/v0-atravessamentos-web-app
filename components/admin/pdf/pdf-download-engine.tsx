"use client"

import React from "react"
import { PDFDownloadLink } from "@react-pdf/renderer"
import { MemberPortfolioPDF } from "./member-portfolio-pdf"
import { type Member, type Project } from "@/lib/mock-data"
import { FileDown, Loader2 } from "lucide-react"

interface PDFDownloadEngineProps {
  member: Member
  projects: Project[]
}

// Este componente isolado permite que o Next.js divida o pacote (Code Splitting).
// O @react-pdf/renderer só será enviado ao navegador quando este componente for renderizado.
export default function PDFDownloadEngine({ member, projects }: PDFDownloadEngineProps) {
  return (
    <PDFDownloadLink
      document={<MemberPortfolioPDF member={member} projects={projects} />}
      fileName={`portfolio_${member.name.toLowerCase().replace(/\s+/g, "_")}.pdf`}
      className="inline-flex h-8 items-center justify-center gap-1 rounded-full border border-primary bg-primary px-3 text-xs font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
    >
      {({ loading }) =>
        loading ? (
          <>
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>Gerando arquivo...</span>
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
