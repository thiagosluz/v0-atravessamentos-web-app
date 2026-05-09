import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"

interface BackButtonProps {
  href: string
  label?: string
  className?: string
}

export function BackButton({ href, label = "Voltar para o início", className }: BackButtonProps) {
  return (
    <Link 
      href={href} 
      className={cn(
        "inline-flex items-center gap-2 text-sm font-medium text-foreground/50 hover:text-primary transition-colors group",
        className
      )}
    >
      <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
      {label}
    </Link>
  )
}
