"use client"

import * as React from "react"
import { type BlogPost } from "@/lib/mock-data"
import { type Category } from "@/lib/actions/categories"
import { AdminDataTable, type Column } from "@/components/admin/admin-data-table"
import { BlogFormDialog } from "@/components/admin/blog-form-dialog"
import { Pagination } from "@/components/admin/pagination"
import { cn } from "@/lib/utils"

interface BlogPanelProps {
  posts: BlogPost[]
  totalCount: number
  currentPage: number
  categories: Category[]
  onSuccess: (post: BlogPost, isEdit: boolean) => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onDeleteBulk: (ids: string[]) => Promise<void>
}

const statusStyles = {
  Publicado: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:bg-emerald-500/20 dark:text-emerald-400",
  Rascunho: "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:bg-amber-500/20 dark:text-amber-400",
  "Em revisão": "bg-primary/10 text-primary border-primary/20",
} as const

export function BlogPanel({
  posts,
  totalCount,
  currentPage,
  categories,
  onSuccess,
  onEdit,
  onDelete,
  onDeleteBulk,
}: BlogPanelProps) {
  const columns: Column<BlogPost>[] = [
    {
      id: "status",
      label: "Status",
      sortable: true,
      render: (post) => (
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
            statusStyles[post.status as keyof typeof statusStyles] || statusStyles.Publicado
          )}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          {post.status || "Publicado"}
        </span>
      ),
    },
    {
      id: "title",
      label: "Título",
      sortable: true,
      render: (post) => (
        <div className="min-w-0">
          <p className="truncate font-medium">{post.title}</p>
          <p className="truncate text-xs text-foreground/50">Por {post.author}</p>
        </div>
      ),
    },
    { id: "category", label: "Categoria", sortable: true },
    {
      id: "date",
      label: "Data",
      sortable: true,
      render: (post) => (
        <span className="text-sm text-foreground/65">
          {new Date(post.date).toLocaleDateString("pt-BR")}
        </span>
      ),
    },
  ]

  return (
    <>
      <div className="flex flex-col gap-4 border-b border-border p-4 md:flex-row md:items-center md:justify-between md:p-6">
        <div>
          <h2 className="font-display text-lg font-bold tracking-tight md:text-xl">
            Diário de Travessia
          </h2>
          <p className="mt-1 text-sm text-foreground/65">Gerencie os posts do blog e artigos.</p>
        </div>
        <BlogFormDialog
          categories={categories.filter((c) => c.type === "post")}
          onSuccess={onSuccess}
        />
      </div>
      <AdminDataTable
        data={posts}
        columns={columns}
        entityName="blog"
        onEdit={onEdit}
        onDelete={onDelete}

        onDeleteBulk={onDeleteBulk}
        labels={{ edit: "Editar post", delete: "Excluir post" }}
      />
      <Pagination totalCount={totalCount} pageSize={10} currentPage={currentPage} paramName="b_page" />
    </>
  )
}
