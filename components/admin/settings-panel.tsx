"use client"

import * as React from "react"
import { Plus, Trash2, Pencil, GripVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { type Category, deleteCategory } from "@/lib/actions/categories"
import { CategoryFormDialog } from "@/components/admin/category-form-dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface SettingsPanelProps {
  categories: Category[]
}

export function SettingsPanel({ categories: initialCategories }: SettingsPanelProps) {
  const [categories, setCategories] = React.useState<Category[]>(initialCategories)

  return (
    <Tabs defaultValue="posts" className="flex flex-col w-full">
      <div className="border-b border-border px-4 py-3 md:px-6 md:py-4 bg-muted/10">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="posts">Categorias do Diário</TabsTrigger>
          <TabsTrigger value="projects">Categorias de Projetos</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="posts" className="m-0 border-0 outline-none">
        <CategoryManager 
          type="post"
          title="Categorias do Diário"
          description="Assuntos e temáticas para classificar os posts do blog."
          categories={categories.filter(c => c.type === "post")}
          onChange={(newCats) => setCategories([...categories.filter(c => c.type !== "post"), ...newCats])}
        />
      </TabsContent>
      <TabsContent value="projects" className="m-0 border-0 outline-none">
        <CategoryManager 
          type="project"
          title="Categorias de Projetos"
          description="As áreas de atuação para classificar os Projetos no arquivo."
          categories={categories.filter(c => c.type === "project")}
          onChange={(newCats) => setCategories([...categories.filter(c => c.type !== "project"), ...newCats])}
        />
      </TabsContent>
    </Tabs>
  )
}

interface CategoryManagerProps {
  type: "post" | "project"
  title: string
  description: string
  categories: Category[]
  onChange: (categories: Category[]) => void
}

function CategoryManager({ type, title, description, categories, onChange }: CategoryManagerProps) {
  const { toast } = useToast()
  const [deletingId, setDeletingId] = React.useState<string | null>(null)

  function handleSuccess(category: Category, isEdit: boolean) {
    if (isEdit) {
      onChange(categories.map(c => c.id === category.id ? category : c))
    } else {
      onChange([...categories, category])
    }
  }

  async function confirmDelete() {
    if (!deletingId) return

    const { error } = await deleteCategory(deletingId)
    setDeletingId(null)

    if (error) {
      toast({ title: "Erro", description: error, variant: "destructive" })
      return
    }
    
    toast({ title: "Categoria excluída" })
    onChange(categories.filter(c => c.id !== deletingId))
  }

  return (
    <>
      <div className="flex flex-col gap-4 border-b border-border p-4 md:flex-row md:items-center md:justify-between md:p-6">
        <div>
          <h2 className="font-display text-lg font-bold tracking-tight md:text-xl">
            {title}
          </h2>
          <p className="mt-1 text-sm text-foreground/65">
            {description}
          </p>
        </div>
        
        <CategoryFormDialog type={type} onSuccess={handleSuccess} totalCount={categories.length} />
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="w-[50px]"></TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Cor</TableHead>
              <TableHead className="w-[100px] text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-12 text-center text-foreground/60">
                  Nenhuma categoria cadastrada.
                </TableCell>
              </TableRow>
            ) : (
              categories.sort((a,b) => a.sort_order - b.sort_order).map((cat) => (
                <TableRow key={cat.id} className="border-border">
                  <TableCell>
                    <GripVertical className="h-4 w-4 text-foreground/20 cursor-grab" />
                  </TableCell>
                  <TableCell className="font-medium">{cat.name}</TableCell>
                  <TableCell className="text-foreground/60 font-mono text-xs">{cat.slug}</TableCell>
                  <TableCell>
                    {cat.color ? (
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-${cat.color}-500/15 text-${cat.color}-700 dark:text-${cat.color}-400 border border-${cat.color}-500/30`}>
                        {cat.color}
                      </span>
                    ) : (
                      <span className="text-xs text-foreground/40">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <CategoryFormDialog type={type} initialData={cat} onSuccess={handleSuccess} totalCount={categories.length} />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => setDeletingId(cat.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir categoria?</AlertDialogTitle>
            <AlertDialogDescription>
              Posts e projetos que usam esta categoria continuarão com o texto gravado, mas ela deixará de aparecer nos filtros. Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
