"use client"

import * as React from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface OrganicImageProps {
  src?: string | null
  alt?: string
  shape?: "organic" | "organic-2" | "organic-3" | "rounded-3xl" | "rounded-custom"
  overlayColor?: "primary" | "accent" | "ouro" | "foreground" | "none"
  overlayOpacity?: number
  containerClassName?: string
  className?: string
  fallbackSrc: string
  priority?: boolean
  sizes?: string
}

export function OrganicImage({
  src,
  fallbackSrc,
  shape = "organic",
  overlayColor = "none",
  overlayOpacity = 0.15,
  className,
  containerClassName,
  alt = "Imagem do Coletivo",
  priority = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
}: OrganicImageProps) {
  const [imageError, setImageError] = React.useState(false)
  const displaySrc = (imageError || !src ? fallbackSrc : src) as string

  const shapeClasses = {
    "organic": "border-organic",
    "organic-2": "border-organic-2",
    "organic-3": "border-organic-3",
    "rounded-3xl": "rounded-3xl",
    "rounded-custom": "rounded-tl-[3rem] rounded-br-[3rem]",
  }

  const overlayBgClasses = {
    "primary": "bg-primary",
    "accent": "bg-accent",
    "ouro": "bg-[var(--ouro)]",
    "foreground": "bg-foreground",
    "none": "",
  }

  return (
    <div className={cn(
      "relative h-full w-full overflow-hidden",
      shapeClasses[shape],
      containerClassName
    )}>
      <Image
        src={displaySrc}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className={cn("object-cover transition-opacity duration-500", className)}
        onError={() => setImageError(true)}
      />
      
      {/* Overlay translúcido de identidade visual */}
      {overlayColor !== "none" && (
        <div 
          className={cn("absolute inset-0 pointer-events-none", overlayBgClasses[overlayColor])} 
          style={{ opacity: overlayOpacity }}
          aria-hidden="true"
        />
      )}
    </div>
  )
}
