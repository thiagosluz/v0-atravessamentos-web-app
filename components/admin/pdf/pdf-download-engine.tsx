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
  const [base64Avatar, setBase64Avatar] = React.useState<string | null>(null)
  const [isProcessingImage, setIsProcessingImage] = React.useState(
    !!(member.avatar && !member.avatar.includes("placeholder.svg"))
  )

  React.useEffect(() => {
    if (!member.avatar || member.avatar.includes("placeholder.svg")) {
      setIsProcessingImage(false)
      return
    }

    let isMounted = true

    const convertImgToBase64URL = (url: string) => {
      return new Promise<string>((resolve) => {
        const img = new window.Image() // Usa window.Image explicitamente
        img.crossOrigin = "Anonymous"
        
        img.onload = () => {
          const canvas = document.createElement("canvas")
          canvas.width = img.width
          canvas.height = img.height
          const ctx = canvas.getContext("2d")
          
          if (!ctx) {
            resolve(url) // Fallback para URL original
            return
          }
          
          // Fundo branco para caso de PNG/WebP com transparência virando JPEG
          ctx.fillStyle = "#FFFFFF"
          ctx.fillRect(0, 0, canvas.width, canvas.height)
          ctx.drawImage(img, 0, 0)
          
          try {
            const dataURL = canvas.toDataURL("image/jpeg", 0.9)
            resolve(dataURL)
          } catch (e) {
            console.error("Erro ao converter imagem no canvas para PDF:", e)
            resolve(url) // Fallback
          }
        }
        
        img.onerror = (e) => {
          console.error("Erro ao carregar imagem no canvas (CORS?):", e)
          resolve(url) // Fallback para tentar pelo próprio react-pdf
        }
        
        // Cache buster para evitar carregar versão cached sem CORS headers
        img.src = url.includes("?") ? `${url}&cb=${Date.now()}` : `${url}?cb=${Date.now()}`
      })
    }

    convertImgToBase64URL(member.avatar).then((b64) => {
      if (isMounted) {
        setBase64Avatar(b64)
        setIsProcessingImage(false)
      }
    })

    return () => {
      isMounted = false
    }
  }, [member.avatar])

  if (isProcessingImage) {
    return (
      <div className="inline-flex h-8 items-center justify-center gap-1 rounded-full border border-primary bg-primary px-3 text-xs font-medium text-primary-foreground opacity-70">
        <Loader2 className="h-3 w-3 animate-spin" />
        <span>Processando foto...</span>
      </div>
    )
  }

  return (
    <PDFDownloadLink
      document={<MemberPortfolioPDF member={member} projects={projects} base64Avatar={base64Avatar} />}
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
