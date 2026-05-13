"use client"

import * as React from "react"
import { motion, AnimatePresence } from "motion/react"
import { 
  Upload, 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  Loader2, 
  Tag as TagIcon,
  X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { 
  batchUploadGalleryImages, 
  getGalleryTags, 
  createGalleryTag,
  updateGalleryAsset,
  deleteGalleryAsset,
  getGalleryAssets,
  getProjectsForSelect
} from "@/lib/actions/gallery"
import { EditAssetModal } from "./edit-asset-modal"

import { type GalleryAsset, type GalleryTag, type ProjectOption } from "@/types/admin"

export function GalleryAdminPanel() {
  const [isUploading, setIsUploading] = React.useState(false)
  const [tags, setTags] = React.useState<GalleryTag[]>([])
  const [projects, setProjects] = React.useState<ProjectOption[]>([])
  const [assets, setAssets] = React.useState<GalleryAsset[]>([])


  const [newTag, setNewTag] = React.useState("")
  const [selectedTags, setSelectedTags] = React.useState<string[]>([])
  const [editingAssetIndex, setEditingAssetIndex] = React.useState<number | null>(null)
  const { toast } = useToast()

  // Carregar dados iniciais
  React.useEffect(() => {
    loadInitialData()
  }, [])

  async function loadInitialData() {
    const [tagsData, assetsData, projectsData] = await Promise.all([
      getGalleryTags(),
      getGalleryAssets(),
      getProjectsForSelect()
    ])
    console.log("Admin - Projetos carregados:", projectsData)
    setTags(tagsData)
    setAssets(assetsData)
    setProjects(projectsData)
  }

  async function loadAssets() {
    const data = await getGalleryAssets()
    setAssets(data)
  }

  const handleNextAsset = () => {
    if (editingAssetIndex !== null && editingAssetIndex < assets.length - 1) {
      setEditingAssetIndex(editingAssetIndex + 1)
    } else {
      setEditingAssetIndex(null)
    }
  }

  async function handleCreateTag() {
    if (!newTag) return
    const res = await createGalleryTag({ name: newTag })
    if (res.success) {
      setNewTag("")
      const updatedTags = await getGalleryTags()
      setTags(updatedTags)
      toast({ title: "Tag criada com sucesso!" })
    }
  }

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    const formData = new FormData()
    Array.from(files).forEach(file => formData.append("images", file))
    selectedTags.forEach(tag => formData.append("tags", tag))

    const res = await batchUploadGalleryImages(formData)
    setIsUploading(false)

    if (res.success) {
      toast({ 
        title: "Upload concluído!", 
        description: `${res.count} imagens adicionadas ao acervo.` 
      })
      loadAssets()
    } else {
      toast({ 
        title: "Erro no upload", 
        description: res.error, 
        variant: "destructive" 
      })
    }
  }

  const toggleTag = (tagName: string) => {
    if (selectedTags.includes(tagName)) {
      setSelectedTags(selectedTags.filter(t => t !== tagName))
    } else {
      setSelectedTags([...selectedTags, tagName])
    }
  }

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-border p-4 md:flex-row md:items-center md:justify-between md:p-6">
        <div className="space-y-1">
          <h3 className="font-display text-lg font-bold flex items-center gap-2 md:text-xl">
            <ImageIcon className="h-5 w-5 text-primary" />
            Acervo de Mídias
          </h3>
          <p className="text-sm text-foreground/65">
            Gerencie o repositório de imagens e vídeos do coletivo.
          </p>
        </div>
      </div>

      <div className="p-6 md:p-10 space-y-12">
        {/* Upload Section */}
        <section className="rounded-3xl border-2 border-dashed border-border bg-card/50 p-12 transition-colors hover:border-primary/20">
          <label className="flex cursor-pointer flex-col items-center justify-center gap-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Upload className="h-8 w-8" />
            </div>
            <div className="space-y-1">
              <h3 className="font-display text-xl font-bold">Upload em Lote</h3>
              <p className="text-sm text-foreground/60">Arraste ou clique para enviar até 20 fotos de uma vez</p>
            </div>
            
            {/* Tag Selection during upload */}
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              {tags.map(tag => (
                <Badge 
                  key={tag.id}
                  variant={selectedTags.includes(tag.name) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault()
                    toggleTag(tag.name)
                  }}
                >
                  {tag.name}
                </Badge>
              ))}
            </div>

            <input 
              type="file" 
              multiple 
              accept="image/*" 
              className="hidden" 
              onChange={onFileChange}
              disabled={isUploading}
            />
          </label>
        </section>

        {/* Tags Management */}
        <section className="space-y-4">
          <h3 className="font-display text-lg font-bold flex items-center gap-2">
            <TagIcon className="h-5 w-5" />
            Hashtags Conceituais
          </h3>
          <div className="flex gap-2">
            <Input 
              placeholder="Nova hashtag (ex: cerrado)" 
              className="max-w-xs h-10 rounded-xl"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateTag()}
            />
            <Button onClick={handleCreateTag} className="rounded-xl bg-primary text-primary-foreground">
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Tag
            </Button>
          </div>
        </section>

        {/* Grid de Ativos */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-bold flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Memória do Coletivo
            </h3>
            <p className="text-xs text-foreground/60">Os ativos aparecerão aqui após o upload.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {assets.map((asset, index) => (
                <motion.div
                  key={asset.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  onClick={() => setEditingAssetIndex(index)}
                  className="group relative aspect-square overflow-hidden rounded-2xl bg-muted cursor-pointer"
                >
                  <img 
                    src={asset.image_url} 
                    alt={asset.title} 
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  
                  {/* Overlay de Info */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 flex flex-col justify-end p-3">
                    <div className="text-white">
                      <p className="text-xs font-bold truncate">{asset.title}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {asset.tags?.map((t: string) => (
                          <span key={t} className="text-[8px] bg-white/20 px-1 rounded">#{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isUploading && (
              <div className="aspect-square animate-pulse rounded-2xl bg-muted flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-primary/40" />
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Modal de Curadoria Sequencial */}
      <EditAssetModal
        asset={editingAssetIndex !== null ? assets[editingAssetIndex] : null}
        isOpen={editingAssetIndex !== null}
        onClose={() => setEditingAssetIndex(null)}
        onSuccess={loadAssets}
        onNext={editingAssetIndex !== null && editingAssetIndex < assets.length - 1 ? handleNextAsset : undefined}
        projects={projects}
        availableTags={tags}
      />
    </div>
  )
}
