"use client"

import * as React from "react"
import { type Project } from "@/lib/mock-data"
import { type Category } from "@/lib/actions/categories"
import { AdminDataTable, type Column } from "../table/admin-data-table"
import { ProjectFormDialog } from "../forms/project-form-dialog"
import { Pagination } from "../shared/pagination"
import { cn } from "@/lib/utils"

interface ProjectPanelProps {
  projects: Project[]
  totalCount: number
  currentPage: number
  categories: Category[]
  onSuccess: (project: Project, isEdit: boolean) => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onDeleteBulk: (ids: string[]) => Promise<void>
}

const statusStyles = {
  Publicado: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:bg-emerald-500/20 dark:text-emerald-400",
  Rascunho: "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:bg-amber-500/20 dark:text-amber-400",
  "Em revisão": "bg-primary/10 text-primary border-primary/20",
} as const

export function ProjectPanel({
  projects,
  totalCount,
  currentPage,
  categories,
  onSuccess,
  onEdit,
  onDelete,
  onDeleteBulk,
}: ProjectPanelProps) {
  const columns: Column<Project>[] = [
    {
      id: "status",
      label: "Status",
      sortable: true,
      render: (p) => (
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
            statusStyles[p.status]
          )}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          {p.status}
        </span>
      ),
    },
    {
      id: "title",
      label: "Título",
      sortable: true,
      render: (p) => (
        <div className="flex items-center gap-3">
          <div className="hidden h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-muted sm:block">
            <img
              src={p.coverImage || "/placeholder.svg"}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <p className="truncate font-medium">{p.title}</p>
            <p className="truncate text-xs text-foreground md:hidden">
              {p.category} · {p.year}
            </p>
          </div>
        </div>
      ),
    },
    { id: "category", label: "Categoria", sortable: true },
    {
      id: "updatedAt",
      label: "Atualizado",
      sortable: true,
      render: (p) => (
        <span className="text-sm text-foreground">
          {new Date(p.updatedAt).toLocaleDateString("pt-BR")}
        </span>
      ),
    },
  ]

  return (
    <>
      <div className="flex flex-col gap-4 border-b border-border p-4 md:flex-row md:items-center md:justify-between md:p-6">
        <div>
          <h2 className="font-display text-lg font-bold tracking-tight md:text-xl">
            Projetos recentes
          </h2>
          <p className="mt-1 text-sm text-foreground">
            Gerencie publicações, rascunhos e revisões do coletivo.
          </p>
        </div>
        <ProjectFormDialog
          categories={categories.filter((c) => c.type === "project")}
          onSuccess={onSuccess}
        />
      </div>

      <AdminDataTable
        data={projects}
        columns={columns}
        entityName="projetos"
        onEdit={onEdit}
        onDelete={onDelete}
        onDeleteBulk={onDeleteBulk}
        labels={{ edit: "Editar projeto", delete: "Excluir projeto" }}
      />
      <Pagination totalCount={totalCount} pageSize={10} currentPage={currentPage} paramName="p_page" />
    </>
  )
}
