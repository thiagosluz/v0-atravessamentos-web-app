"use client"

import * as React from "react"
import { useToast } from "@/hooks/use-toast"
import { 
  batchUploadGalleryImages, 
  getGalleryTags, 
  createGalleryTag,
  deleteGalleryTag,
  countGalleryTagUsage,
  getGalleryAssets,
  getProjectsForSelect
} from "@/lib/actions/gallery"
import { EditAssetModal } from "../shared/edit-asset-modal"
import { type GalleryAsset, type GalleryTag, type ProjectOption } from "@/types/admin"

import { GalleryHeader } from "./gallery/gallery-header"
import { UploadSection } from "./gallery/upload-section"
import { TagManagement } from "./gallery/tag-management"
import { AssetGrid } from "./gallery/asset-grid"

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

  async function handleDeleteTag(tagId: string, tagName: string) {
    const res = await deleteGalleryTag(tagId, tagName)
    if (res.success) {
      const updatedTags = await getGalleryTags()
      setTags(updatedTags)
      toast({ title: `Tag "${tagName}" excluída com sucesso` })
    } else {
      toast({ title: "Erro ao excluir tag", description: res.error, variant: "destructive" })
    }
  }

  async function handleCountTagUsage(tagName: string) {
    return countGalleryTagUsage(tagName)
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
      <GalleryHeader />

      <div className="p-6 md:p-10 space-y-12">
        <UploadSection 
          isUploading={isUploading}
          tags={tags}
          selectedTags={selectedTags}
          onToggleTag={toggleTag}
          onFileChange={onFileChange}
        />

        <TagManagement 
          tags={tags}
          newTag={newTag}
          setNewTag={setNewTag}
          onCreateTag={handleCreateTag}
          onDeleteTag={handleDeleteTag}
          onCountUsage={handleCountTagUsage}
        />

        <AssetGrid 
          assets={assets}
          isUploading={isUploading}
          onEditAsset={setEditingAssetIndex}
        />
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
