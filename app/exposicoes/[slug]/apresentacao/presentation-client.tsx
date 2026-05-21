"use client"

import * as React from "react"
import { motion, AnimatePresence } from "motion/react"
import { X, Play, Pause, Maximize, Minimize, ChevronLeft, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

interface PresentationClientProps {
  assets: any[]
  slug: string
}

export function PresentationClient({ assets, slug }: PresentationClientProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [isPlaying, setIsPlaying] = React.useState(true)
  const [intervalTime, setIntervalTime] = React.useState<number>(5000) // 5s por padrão
  const [showControls, setShowControls] = React.useState(true)
  const [isFullscreen, setIsFullscreen] = React.useState(false)
  const router = useRouter()
  
  const timerRef = React.useRef<NodeJS.Timeout | null>(null)
  const mouseTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  // Ocultar cursor e controles quando inativo
  const handleMouseMove = React.useCallback(() => {
    setShowControls(true)
    if (mouseTimeoutRef.current) clearTimeout(mouseTimeoutRef.current)
    
    mouseTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false)
    }, 3000)
  }, [isPlaying])

  React.useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      if (mouseTimeoutRef.current) clearTimeout(mouseTimeoutRef.current)
    }
  }, [handleMouseMove])

  // Lógica de Autoplay
  React.useEffect(() => {
    if (isPlaying && assets.length > 0) {
      timerRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % assets.length)
      }, intervalTime)
    }
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isPlaying, intervalTime, assets.length, currentIndex]) // currentIndex na dependência para resetar o timer ao navegar

  // Controles manuais
  const nextSlide = React.useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % assets.length)
  }, [assets.length])

  const prevSlide = React.useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + assets.length) % assets.length)
  }, [assets.length])

  // Atalhos de teclado
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextSlide()
      if (e.key === "ArrowLeft") prevSlide()
      if (e.key === " ") setIsPlaying(p => !p)
      if (e.key === "Escape" && isFullscreen) toggleFullscreen()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [nextSlide, prevSlide, isFullscreen])

  // Sincronizar estado do fullscreen com eventos do navegador
  React.useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener("fullscreenchange", onFullscreenChange)
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange)
  }, [])

  // Sair do fullscreen ao desmontar o componente para evitar que a próxima página fique em tela cheia
  React.useEffect(() => {
    return () => {
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {})
      }
    }
  }, [])

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Erro ao tentar entrar em modo tela cheia: ${err.message}`)
      })
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {})
      }
    }
  }

  const handleClose = () => {
    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {})
    }
    router.push(`/exposicoes/${slug}`)
  }

  if (assets.length === 0) return (
    <div className="flex h-full items-center justify-center">
      <p className="text-white/60">Nenhuma obra para apresentar.</p>
      <button onClick={handleClose} className="absolute top-8 right-8 z-50">
        <X className="h-8 w-8 text-white/60 hover:text-white" />
      </button>
    </div>
  )

  const currentAsset = assets[currentIndex]

  return (
    <div 
      className={cn(
        "relative h-full w-full overflow-hidden bg-black transition-cursor duration-500",
        !showControls && "cursor-none"
      )}
    >
      {/* Imagem */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0 flex items-center justify-center p-8"
        >
          <img
            src={currentAsset.image_url}
            alt={currentAsset.title}
            className="max-h-full max-w-full object-contain drop-shadow-2xl"
          />
        </motion.div>
      </AnimatePresence>

      {/* Controles (Top) */}
      <div 
        className={cn(
          "absolute inset-x-0 top-0 flex items-center justify-between p-6 bg-gradient-to-b from-black/60 to-transparent transition-opacity duration-500 z-50",
          showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        <button onClick={handleClose} className="rounded-full bg-black/40 p-3 text-white/80 hover:bg-black/60 hover:text-white backdrop-blur-md transition-all">
          <X className="h-6 w-6" />
        </button>
        
        <div className="flex items-center gap-4 rounded-full bg-black/40 px-6 py-3 backdrop-blur-md">
          <button 
            onClick={() => setIntervalTime(5000)} 
            className={cn("text-xs font-bold transition-colors", intervalTime === 5000 ? "text-white" : "text-white/40 hover:text-white/80")}
          >
            5s
          </button>
          <button 
            onClick={() => setIntervalTime(10000)} 
            className={cn("text-xs font-bold transition-colors", intervalTime === 10000 ? "text-white" : "text-white/40 hover:text-white/80")}
          >
            10s
          </button>
          <button 
            onClick={() => setIntervalTime(15000)} 
            className={cn("text-xs font-bold transition-colors", intervalTime === 15000 ? "text-white" : "text-white/40 hover:text-white/80")}
          >
            15s
          </button>
          
          <div className="w-px h-4 bg-white/20 mx-2" />
          
          <button onClick={() => setIsPlaying(!isPlaying)} className="text-white hover:scale-110 transition-transform">
            {isPlaying ? <Pause className="h-5 w-5 fill-white" /> : <Play className="h-5 w-5 fill-white" />}
          </button>
          
          <div className="w-px h-4 bg-white/20 mx-2" />
          
          <button onClick={toggleFullscreen} className="text-white/80 hover:text-white transition-colors">
            {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Controles Laterais */}
      <div 
        className={cn(
          "absolute inset-y-0 left-0 flex items-center px-4 transition-opacity duration-500 z-40",
          showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        <button onClick={prevSlide} className="rounded-full bg-black/20 p-4 text-white/60 hover:bg-black/60 hover:text-white backdrop-blur-md transition-all">
          <ChevronLeft className="h-8 w-8" />
        </button>
      </div>
      
      <div 
        className={cn(
          "absolute inset-y-0 right-0 flex items-center px-4 transition-opacity duration-500 z-40",
          showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        <button onClick={nextSlide} className="rounded-full bg-black/20 p-4 text-white/60 hover:bg-black/60 hover:text-white backdrop-blur-md transition-all">
          <ChevronRight className="h-8 w-8" />
        </button>
      </div>

      {/* Legenda (Bottom) */}
      <div 
        className={cn(
          "absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-12 text-center transition-opacity duration-500 z-40 pointer-events-none",
          showControls ? "opacity-100" : "opacity-0"
        )}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-display text-4xl font-bold tracking-wide drop-shadow-lg">
              {currentAsset.title}
            </h2>
            {currentAsset.location && (
              <p className="mt-2 text-lg italic text-white/80 font-light tracking-widest">
                {currentAsset.location}
              </p>
            )}
            
            {/* Progresso visual */}
            <div className="mt-8 flex justify-center gap-2">
              {assets.map((_, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "h-1 rounded-full transition-all duration-500",
                    i === currentIndex ? "w-8 bg-white" : "w-2 bg-white/20"
                  )} 
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
