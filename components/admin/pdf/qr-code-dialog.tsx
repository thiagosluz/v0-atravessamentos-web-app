"use client"

import * as React from "react"
import dynamic from "next/dynamic"

const QRCodeSVG = dynamic(() => import("qrcode.react").then((mod) => mod.QRCodeSVG), { 
  ssr: false,
  loading: () => <div className="h-[200px] w-[200px] animate-pulse bg-muted rounded-md" />
})
import { QrCode, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface QrCodeDialogProps {
  url: string
  title: string
}

export function QrCodeDialog({ url, title }: QrCodeDialogProps) {
  const downloadQR = () => {
    const svg = document.getElementById("qr-code-svg")
    if (!svg) return

    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const img = new Image()

    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.width // Keep it square
      ctx?.drawImage(img, 0, 0)
      const pngFile = canvas.toDataURL("image/png")
      const downloadLink = document.createElement("a")
      downloadLink.download = `qrcode_${title.toLowerCase().replace(/\\s+/g, "_")}.png`
      downloadLink.href = pngFile
      downloadLink.click()
    }

    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)))
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-xl" title="QR Code da Exposição">
          <QrCode className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-3xl p-8">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl font-bold tracking-tight">
            QR Code da Exposição
          </DialogTitle>
          <DialogDescription>
            Compartilhe este código para acesso direto à exposição "{title}".
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center justify-center py-8 space-y-6">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-border">
            <QRCodeSVG
              id="qr-code-svg"
              value={url}
              size={200}
              bgColor={"#ffffff"}
              fgColor={"#333333"}
              level={"Q"}
              includeMargin={false}
            />
          </div>
          
          <Button 
            onClick={downloadQR}
            className="rounded-full bg-primary text-primary-foreground gap-2 hover:bg-primary/90"
          >
            <Download className="h-4 w-4" />
            Baixar QR Code (PNG)
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
